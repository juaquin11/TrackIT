import { prisma } from '../prisma/client';

export class SavedMealService {
  /**
   * Listar todos los platos guardados con sus ingredientes y macros totales calculados
   */
  public static async getAllSavedMeals() {
    const meals = await prisma.savedMeal.findMany({
      include: {
        items: {
          include: { food: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular macros totales de cada plato
    return meals.map(meal => {
      const totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

      for (const item of meal.items) {
        const ratio = item.gramos / item.food.porcionBase;
        totales.calorias += Math.round(item.food.calorias * ratio);
        totales.proteinas += Math.round(item.food.proteinas * ratio * 10) / 10;
        totales.carbohidratos += Math.round(item.food.carbohidratos * ratio * 10) / 10;
        totales.grasas += Math.round(item.food.grasas * ratio * 10) / 10;
      }

      return {
        ...meal,
        totales: {
          calorias: Math.round(totales.calorias),
          proteinas: Math.round(totales.proteinas),
          carbohidratos: Math.round(totales.carbohidratos),
          grasas: Math.round(totales.grasas)
        }
      };
    });
  }

  /**
   * Crear un nuevo plato guardado con sus ingredientes
   */
  public static async createSavedMeal(
    nombre: string,
    categoria: string,
    items: { foodId: number; gramos: number }[]
  ) {
    const meal = await prisma.savedMeal.create({
      data: {
        nombre,
        categoria,
        items: {
          create: items.map(item => ({
            gramos: item.gramos,
            foodId: item.foodId
          }))
        }
      },
      include: {
        items: {
          include: { food: true }
        }
      }
    });

    return meal;
  }

  /**
   * Aplicar un plato guardado al día indicado (o al día de hoy).
   * Crea/obtiene el DailyRecord y genera los ConsumedFood correspondientes.
   */
  public static async applySavedMealToDay(savedMealId: number, fecha?: Date) {
    const targetDate = fecha || new Date();
    // Normalizar a solo fecha (sin hora) para el campo @db.Date
    const dateOnly = new Date(targetDate.toISOString().split('T')[0]);

    // 1. Obtener el plato con sus ingredientes
    const savedMeal = await prisma.savedMeal.findUnique({
      where: { id: savedMealId },
      include: {
        items: {
          include: { food: true }
        }
      }
    });

    if (!savedMeal) {
      throw new Error('Plato guardado no encontrado');
    }

    // 2. Obtener o crear el DailyRecord de ese día
    let dailyRecord = await prisma.dailyRecord.findUnique({
      where: { fecha: dateOnly }
    });

    if (!dailyRecord) {
      dailyRecord = await prisma.dailyRecord.create({
        data: { fecha: dateOnly }
      });
    }

    // 3. Crear un ConsumedFood por cada ingrediente del plato
    const consumedFoods = await Promise.all(
      savedMeal.items.map(item =>
        prisma.consumedFood.create({
          data: {
            gramos: item.gramos,
            foodId: item.foodId,
            recordId: dailyRecord!.id
          },
          include: { food: true }
        })
      )
    );

    // 4. Calcular macros totales aplicados
    const totalesAplicados = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };
    for (const cf of consumedFoods) {
      const ratio = cf.gramos / cf.food.porcionBase;
      totalesAplicados.calorias += Math.round(cf.food.calorias * ratio);
      totalesAplicados.proteinas += Math.round(cf.food.proteinas * ratio * 10) / 10;
      totalesAplicados.carbohidratos += Math.round(cf.food.carbohidratos * ratio * 10) / 10;
      totalesAplicados.grasas += Math.round(cf.food.grasas * ratio * 10) / 10;
    }

    return {
      mensaje: `Plato "${savedMeal.nombre}" aplicado al ${dateOnly.toISOString().split('T')[0]}`,
      platoAplicado: savedMeal.nombre,
      fecha: dateOnly,
      alimentosRegistrados: consumedFoods.length,
      totalesAplicados: {
        calorias: Math.round(totalesAplicados.calorias),
        proteinas: Math.round(totalesAplicados.proteinas),
        carbohidratos: Math.round(totalesAplicados.carbohidratos),
        grasas: Math.round(totalesAplicados.grasas)
      }
    };
  }

  /**
   * Eliminar un plato guardado (los items se eliminan en cascada)
   */
  public static async deleteSavedMeal(id: number) {
    return prisma.savedMeal.delete({
      where: { id }
    });
  }
}
