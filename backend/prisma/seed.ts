import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de Seed...');

  // Limpiar la base de datos (orden de eliminación para evitar errores de claves foráneas)
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

  // 2. Crear Alimentos
  console.log('Creando alimentos...');
  const foodsToCreate = [
    {
      nombre: 'Pechuga de pollo (cruda)',
      porcionBase: 100,
      calorias: 110,
      proteinas: 23,
      carbohidratos: 0,
      grasas: 1.2,
      tags: {
        connect: [{ id: tagProteina.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }, { id: tagKeto.id }],
      },
    },
    {
      nombre: 'Arroz blanco (crudo)',
      porcionBase: 100,
      calorias: 365,
      proteinas: 7,
      carbohidratos: 80,
      grasas: 1,
      tags: {
        connect: [{ id: tagCarbo.id }, { id: tagAlmuerzo.id }, { id: tagCena.id }],
      },
    },
    {
      nombre: 'Huevo entero (L)',
      porcionBase: 50,
      calorias: 78,
      proteinas: 6,
      carbohidratos: 0.6,
      grasas: 5,
      tags: {
        connect: [{ id: tagProteina.id }, { id: tagGrasa.id }, { id: tagDesayuno.id }, { id: tagKeto.id }],
      },
    },
    {
      nombre: 'Avena en hojuelas',
      porcionBase: 100,
      calorias: 389,
      proteinas: 16.9,
      carbohidratos: 66.3,
      grasas: 6.9,
      tags: {
        connect: [{ id: tagCarbo.id }, { id: tagDesayuno.id }, { id: tagSnack.id }],
      },
    },
    {
      nombre: 'Aceite de oliva extra virgen',
      porcionBase: 15, // 1 cucharada aprox
      calorias: 119,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 13.5,
      tags: {
        connect: [{ id: tagGrasa.id }, { id: tagKeto.id }],
      },
    }
  ];

  for (const food of foodsToCreate) {
    await prisma.food.create({ data: food });
  }

  // 3. Crear Usuario Base
  console.log('Creando usuario de prueba...');
  await prisma.user.create({
    data: {
      pesoKg: 75,
      alturaCm: 175,
      edad: 28,
      genero: 'M',
      factorActividad: 1.55, // Moderadamente activo
      objetivo: 'Recomposicion',
    },
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
