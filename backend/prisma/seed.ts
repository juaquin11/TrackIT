import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de Seed...');

  // Limpiar la base de datos
  await prisma.savedMealItem.deleteMany();
  await prisma.savedMeal.deleteMany();
  await prisma.consumedFood.deleteMany();
  await prisma.dailyRecord.deleteMany();
  await prisma.food.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear Etiquetas (Tags)
  console.log('Creando etiquetas...');
  const tagProteina = await prisma.tag.create({ data: { name: 'fuente_proteina' } });
  const tagCarbo = await prisma.tag.create({ data: { name: 'fuente_carbohidratos' } });
  const tagGrasa = await prisma.tag.create({ data: { name: 'fuente_grasas' } });
  const tagDesayuno = await prisma.tag.create({ data: { name: 'desayuno' } });
  const tagAlmuerzo = await prisma.tag.create({ data: { name: 'almuerzo' } });
  const tagCena = await prisma.tag.create({ data: { name: 'cena' } });
  const tagSnack = await prisma.tag.create({ data: { name: 'snack' } });
  const tagKeto = await prisma.tag.create({ data: { name: 'keto' } });

  // 2. Crear Alimentos del PDF
  console.log('Creando alimentos...');
  const foodsToCreate = [
    // PROTEÍNAS Y CARNES
    { nombre: 'Pechuga de pollo (cruda)', porcionBase: 100, calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6, tags: { connect: [{ id: tagProteina.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }, { id: tagKeto.id }] } },
    { nombre: 'Carne vacuna magra (cruda)', porcionBase: 100, calorias: 200, proteinas: 26, carbohidratos: 0, grasas: 10, tags: { connect: [{ id: tagProteina.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }, { id: tagKeto.id }] } },
    { nombre: 'Costeleta de cerdo (cruda)', porcionBase: 100, calorias: 197, proteinas: 19, carbohidratos: 0, grasas: 13, tags: { connect: [{ id: tagProteina.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }, { id: tagKeto.id }] } },
    { nombre: 'Atún en lata', porcionBase: 100, calorias: 116, proteinas: 26, carbohidratos: 0, grasas: 1, tags: { connect: [{ id: tagProteina.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }, { id: tagKeto.id }] } },
    { nombre: 'Huevos', porcionBase: 50, calorias: 78, proteinas: 6.5, carbohidratos: 0.6, grasas: 5.5, tags: { connect: [{ id: tagProteina.id }, { id: tagGrasa.id }, { id: tagDesayuno.id }, { id: tagKeto.id }] } },
    
    // CARBOHIDRATOS, FRUTAS Y VERDURAS
    { nombre: 'Arroz integral (crudo)', porcionBase: 100, calorias: 355, proteinas: 8, carbohidratos: 74, grasas: 3, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }] } },
    { nombre: 'Arroz blanco (crudo)', porcionBase: 100, calorias: 350, proteinas: 7, carbohidratos: 78, grasas: 1, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }] } },
    { nombre: 'Fideos secos', porcionBase: 100, calorias: 350, proteinas: 12, carbohidratos: 71, grasas: 1.5, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }] } },
    { nombre: 'Pan integral', porcionBase: 25, calorias: 60, proteinas: 3, carbohidratos: 11, grasas: 1, tags: { connect: [{ id: tagCarbo.id }, { id: tagDesayuno.id }, { id: tagSnack.id }] } },
    { nombre: 'Avena tradicional/Instantánea', porcionBase: 10, calorias: 38, proteinas: 1.3, carbohidratos: 6.8, grasas: 0.7, tags: { connect: [{ id: tagCarbo.id }, { id: tagDesayuno.id }, { id: tagSnack.id }] } },
    { nombre: 'Papa', porcionBase: 100, calorias: 77, proteinas: 2, carbohidratos: 17, grasas: 0.1, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }] } },
    { nombre: 'Batata', porcionBase: 100, calorias: 86, proteinas: 1.6, carbohidratos: 20, grasas: 0.1, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }] } },
    { nombre: 'Banana', porcionBase: 100, calorias: 89, proteinas: 1.1, carbohidratos: 23, grasas: 0.3, tags: { connect: [{ id: tagCarbo.id }, { id: tagSnack.id }, { id: tagDesayuno.id }] } },
    { nombre: 'Manzana', porcionBase: 100, calorias: 52, proteinas: 0.3, carbohidratos: 14, grasas: 0.2, tags: { connect: [{ id: tagCarbo.id }, { id: tagSnack.id }] } },
    { nombre: 'Zanahoria', porcionBase: 100, calorias: 41, proteinas: 0.9, carbohidratos: 9.6, grasas: 0.2, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }] } },
    { nombre: 'Tomate', porcionBase: 100, calorias: 18, proteinas: 0.9, carbohidratos: 3.9, grasas: 0.2, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }] } },
    { nombre: 'Garbanzos', porcionBase: 100, calorias: 364, proteinas: 19, carbohidratos: 61, grasas: 6, tags: { connect: [{ id: tagCarbo.id }, { id: tagProteina.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }] } },
    { nombre: 'Lentejas', porcionBase: 100, calorias: 353, proteinas: 25, carbohidratos: 60, grasas: 1, tags: { connect: [{ id: tagCarbo.id }, { id: tagProteina.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }] } },
    { nombre: 'Arvejas', porcionBase: 100, calorias: 81, proteinas: 5.4, carbohidratos: 14.5, grasas: 0.4, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }] } },
    { nombre: 'Pepino', porcionBase: 100, calorias: 15, proteinas: 0.6, carbohidratos: 3.6, grasas: 0.1, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }] } },
    { nombre: 'Lechuga', porcionBase: 100, calorias: 15, proteinas: 1.4, carbohidratos: 2.9, grasas: 0.2, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }] } },
    { nombre: 'Champiñones', porcionBase: 100, calorias: 22, proteinas: 3.1, carbohidratos: 3.3, grasas: 0.3, tags: { connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }] } },

    // GRASAS Y FRUTOS SECOS
    { nombre: 'Palta', porcionBase: 100, calorias: 160, proteinas: 2, carbohidratos: 9, grasas: 15, tags: { connect: [{ id: tagGrasa.id }, { id: tagDesayuno.id }, { id: tagAlmuerzo.id }] } },
    { nombre: 'Aceite de oliva', porcionBase: 10, calorias: 88, proteinas: 0, carbohidratos: 0, grasas: 10, tags: { connect: [{ id: tagGrasa.id }, { id: tagKeto.id }] } },
    { nombre: 'Aceite de coco', porcionBase: 10, calorias: 89, proteinas: 0, carbohidratos: 0, grasas: 10, tags: { connect: [{ id: tagGrasa.id }, { id: tagKeto.id }] } },
    { nombre: 'Pasta de maní', porcionBase: 10, calorias: 60, proteinas: 2.5, carbohidratos: 1, grasas: 5, tags: { connect: [{ id: tagGrasa.id }, { id: tagSnack.id }, { id: tagDesayuno.id }] } },
    { nombre: 'Almendras / Nueces', porcionBase: 10, calorias: 58, proteinas: 2, carbohidratos: 2, grasas: 5, tags: { connect: [{ id: tagGrasa.id }, { id: tagSnack.id }] } },
    { nombre: 'Chocolate amargo 80%', porcionBase: 10, calorias: 59, proteinas: 1, carbohidratos: 2.5, grasas: 5, tags: { connect: [{ id: tagGrasa.id }, { id: tagSnack.id }] } },

    // LÁCTEOS Y OTROS
    { nombre: 'Leche entera', porcionBase: 100, calorias: 61, proteinas: 3.2, carbohidratos: 4.8, grasas: 3.3, tags: { connect: [{ id: tagCarbo.id }, { id: tagProteina.id }, { id: tagDesayuno.id }, { id: tagSnack.id }] } },
    { nombre: 'Leche proteica', porcionBase: 100, calorias: 42, proteinas: 5.2, carbohidratos: 4.6, grasas: 0, tags: { connect: [{ id: tagProteina.id }, { id: tagDesayuno.id }, { id: tagSnack.id }] } },
    { nombre: 'Yogur natural', porcionBase: 100, calorias: 60, proteinas: 3.5, carbohidratos: 4.7, grasas: 3.3, tags: { connect: [{ id: tagProteina.id }, { id: tagCarbo.id }, { id: tagDesayuno.id }, { id: tagSnack.id }] } },
    { nombre: 'Queso untable light', porcionBase: 10, calorias: 15, proteinas: 1, carbohidratos: 0.5, grasas: 1, tags: { connect: [{ id: tagGrasa.id }, { id: tagDesayuno.id }] } },
    { nombre: 'Queso cremoso', porcionBase: 100, calorias: 300, proteinas: 22, carbohidratos: 2, grasas: 23, tags: { connect: [{ id: tagProteina.id }, { id: tagGrasa.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }, { id: tagKeto.id }] } },
  ];

  const createdFoods = [];
  for (const food of foodsToCreate) {
    const created = await prisma.food.create({ data: food });
    createdFoods.push(created);
  }

  // 3. Crear Usuario Base
  console.log('Creando usuario de prueba...');
  await prisma.user.create({
    data: {
      pesoKg: 75,
      alturaCm: 175,
      edad: 28,
      genero: 'M',
      factorActividad: 1.55,
      objetivo: 'Recomposicion',
    },
  });

  // 4. Crear Platos Guardados de Ejemplo
  console.log('Creando platos guardados de ejemplo...');
  
  // Encontrar alimentos específicos para los platos de ejemplo
  const pollo = createdFoods.find(f => f.nombre.includes('Pechuga de pollo'))!;
  const arroz = createdFoods.find(f => f.nombre.includes('Arroz blanco'))!;
  const huevo = createdFoods.find(f => f.nombre.includes('Huevos'))!;
  const avena = createdFoods.find(f => f.nombre.includes('Avena'))!;
  const aceite = createdFoods.find(f => f.nombre.includes('Aceite de oliva'))!;

  await prisma.savedMeal.create({
    data: {
      nombre: 'Desayuno clásico',
      categoria: 'Desayuno',
      items: {
        create: [
          { gramos: 80, foodId: avena.id },
          { gramos: 100, foodId: huevo.id }, // 2 huevos aprox
        ]
      }
    }
  });

  await prisma.savedMeal.create({
    data: {
      nombre: 'Almuerzo fitness',
      categoria: 'Almuerzo',
      items: {
        create: [
          { gramos: 200, foodId: pollo.id },
          { gramos: 150, foodId: arroz.id },
          { gramos: 10, foodId: aceite.id },
        ]
      }
    }
  });

  await prisma.savedMeal.create({
    data: {
      nombre: 'Post-entreno rápido',
      categoria: 'Post-entreno',
      items: {
        create: [
          { gramos: 150, foodId: pollo.id },
          { gramos: 100, foodId: arroz.id },
        ]
      }
    }
  });

  console.log('Seed completado con éxito! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
