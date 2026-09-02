import { prisma } from '../prisma/client';
import { MacroTargets } from './calculator.service';

export interface PlannedFood {
  foodId: number;
  nombre: string;
  gramosSugeridos: number;
  macros: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    calorias: number;
  }
}

export interface MealPlan {
  nombreComida: string;
  alimentos: PlannedFood[];
  totales: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    calorias: number;
  }
}

export class PlannerService {
  /**
   * Genera un plan de comidas heurístico
   * @param targets Macros totales del día
   * @param meals Lista de nombres de comidas (ej. ['Desayuno', 'Almuerzo'])
   */
  public static async generatePlan(targets: MacroTargets, meals: string[]): Promise<MealPlan[]> {
    if (!meals || meals.length === 0) {
      throw new Error('Debe proporcionar al menos una comida');
    }

    const mealCount = meals.length;
    
    // Fraccionamiento equitativo (podría ser parametrizable en el futuro)
    const mealTargets = {
      proteinas: targets.proteinas / mealCount,
      carbohidratos: targets.carbohidratos / mealCount,
      grasas: targets.grasas / mealCount,
      calorias: targets.caloriasObjetivo / mealCount
    };

    // Obtener alimentos base de la DB con sus tags
    const allFoods = await prisma.food.findMany({
      include: { tags: true }
    });

    // Categorizar alimentos por etiqueta estructural principal
    const proteinaFoods = allFoods.filter(f => f.tags.some(t => t.name === 'fuente_proteina'));
    const carboFoods = allFoods.filter(f => f.tags.some(t => t.name === 'fuente_carbohidratos'));
    const grasaFoods = allFoods.filter(f => f.tags.some(t => t.name === 'fuente_grasas'));

    if (proteinaFoods.length === 0 || carboFoods.length === 0 || grasaFoods.length === 0) {
      throw new Error('No hay suficientes alimentos en la base de datos para cubrir los macros.');
    }

    const plan: MealPlan[] = [];

    for (const mealName of meals) {
      // 1. Elegir aleatoriamente 1 alimento de cada categoría estructural
      const selectedProteina = proteinaFoods[Math.floor(Math.random() * proteinaFoods.length)];
      const selectedCarbo = carboFoods[Math.floor(Math.random() * carboFoods.length)];
      const selectedGrasa = grasaFoods[Math.floor(Math.random() * grasaFoods.length)];

      // 2. Calcular los gramos (Lógica heurística simple)
      // Gramos = (Objetivo Macro / (Macro del alimento por gramo))
      
      const gProteina = this.calculateGrams(mealTargets.proteinas, selectedProteina.proteinas, selectedProteina.porcionBase);
      const gCarbo = this.calculateGrams(mealTargets.carbohidratos, selectedCarbo.carbohidratos, selectedCarbo.porcionBase);
      const gGrasa = this.calculateGrams(mealTargets.grasas, selectedGrasa.grasas, selectedGrasa.porcionBase);

      // 3. Empaquetar alimentos calculados
      const alimentosComida: PlannedFood[] = [
        this.formatPlannedFood(selectedProteina, gProteina),
        this.formatPlannedFood(selectedCarbo, gCarbo),
        this.formatPlannedFood(selectedGrasa, gGrasa)
      ];

      // 4. Calcular totales reales de la comida
      let totalP = 0, totalC = 0, totalG = 0, totalCal = 0;
      for (const f of alimentosComida) {
        totalP += f.macros.proteinas;
        totalC += f.macros.carbohidratos;
        totalG += f.macros.grasas;
        totalCal += f.macros.calorias;
      }

      plan.push({
        nombreComida: mealName,
        alimentos: alimentosComida,
        totales: {
          proteinas: Math.round(totalP),
          carbohidratos: Math.round(totalC),
          grasas: Math.round(totalG),
          calorias: Math.round(totalCal)
        }
      });
    }

    return plan;
  }

  private static calculateGrams(targetMacro: number, foodMacroPerPortion: number, portionSize: number): number {
    if (foodMacroPerPortion <= 0) return 0;
    const macroPerGram = foodMacroPerPortion / portionSize;
    return Math.round(targetMacro / macroPerGram);
  }

  private static formatPlannedFood(food: any, gramos: number): PlannedFood {
    const ratio = gramos / food.porcionBase;
    return {
      foodId: food.id,
      nombre: food.nombre,
      gramosSugeridos: gramos,
      macros: {
        proteinas: Math.round(food.proteinas * ratio * 10) / 10,
        carbohidratos: Math.round(food.carbohidratos * ratio * 10) / 10,
        grasas: Math.round(food.grasas * ratio * 10) / 10,
        calorias: Math.round(food.calorias * ratio)
      }
    };
  }
}
