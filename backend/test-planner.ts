import { PrismaClient } from '@prisma/client';
import { CalculatorService } from './src/services/calculator.service';
import { PlannerService } from './src/services/planner.service';

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('--- PERFIL DE USUARIO ---');
    console.log(`Peso: ${user.pesoKg}kg, Objetivo: ${user.objetivo}`);

    const targets = CalculatorService.calculateTargets(user);
    console.log('\n--- METAS CALCULADAS ---');
    console.log(targets);

    console.log('\n--- GENERANDO PLAN DE COMIDAS ---');
    const plan = await PlannerService.generatePlan(targets, ['Desayuno', 'Almuerzo', 'Pre-entreno', 'Cena']);
    
    console.log(JSON.stringify(plan, null, 2));

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
