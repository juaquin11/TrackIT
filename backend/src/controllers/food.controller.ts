import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const foods = await prisma.food.findMany({
      include: {
        tags: true,
      },
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener alimentos' });
  }
};

export const getFoodById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const food = await prisma.food.findUnique({
      where: { id: parseInt(id) },
      include: {
        tags: true,
      },
    });
    if (!food) {
      return res.status(404).json({ success: false, error: 'Alimento no encontrado' });
    }
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener el alimento' });
  }
};

export const createFood = async (req: Request, res: Response) => {
  try {
    const { nombre, porcionBase, calorias, proteinas, carbohidratos, grasas, tagIds } = req.body;
    const food = await prisma.food.create({
      data: {
        nombre,
        porcionBase,
        calorias,
        proteinas,
        carbohidratos,
        grasas,
        tags: tagIds ? { connect: tagIds.map((id: number) => ({ id })) } : undefined,
      },
      include: {
        tags: true,
      },
    });
    res.status(201).json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al crear el alimento' });
  }
};
