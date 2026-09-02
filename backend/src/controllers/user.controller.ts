import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { CalculatorService } from '../services/calculator.service';

export const getUser = async (req: Request, res: Response) => {
  try {
    // Como es uso personal, obtenemos el primer usuario
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    // Calculamos los objetivos en tiempo real
    const targets = CalculatorService.calculateTargets(user);

    res.json({ success: true, data: user, targets });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener el usuario' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pesoKg, alturaCm, edad, genero, factorActividad, objetivo } = req.body;
    
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        pesoKg,
        alturaCm,
        edad,
        genero,
        factorActividad,
        objetivo,
      },
    });

    // Devolvemos los nuevos objetivos recalculados
    const targets = CalculatorService.calculateTargets(user);

    res.json({ success: true, data: user, targets });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar el usuario' });
  }
};
