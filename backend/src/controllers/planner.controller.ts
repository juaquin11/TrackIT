import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { CalculatorService } from '../services/calculator.service';
import { PlannerService } from '../services/planner.service';

export const generatePlan = async (req: Request, res: Response) => {
  try {
    const { userId, meals } = req.body;

    if (!userId || !meals || !Array.isArray(meals)) {
      return res.status(400).json({ success: false, error: 'userId y un array de meals son requeridos' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    // 1. Calcular objetivos del usuario
    const targets = CalculatorService.calculateTargets(user);

    // 2. Generar el plan de comidas
    const plan = await PlannerService.generatePlan(targets, meals);

    res.json({ success: true, data: { targets, plan } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error al generar el plan de comidas' });
  }
};
