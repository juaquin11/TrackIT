import { Request, Response } from 'express';
import { SavedMealService } from '../services/savedmeal.service';

export const getAllSavedMeals = async (req: Request, res: Response) => {
  try {
    const meals = await SavedMealService.getAllSavedMeals();
    res.json({ success: true, data: meals });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error al obtener platos guardados' });
  }
};

export const createSavedMeal = async (req: Request, res: Response) => {
  try {
    const { nombre, categoria, items } = req.body;

    if (!nombre || !categoria || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere nombre, categoria y al menos un item con { foodId, gramos }'
      });
    }

    const meal = await SavedMealService.createSavedMeal(nombre, categoria, items);
    res.status(201).json({ success: true, data: meal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error al crear el plato' });
  }
};

export const applySavedMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fecha } = req.body; // Opcional: si no se envía, usa hoy

    const result = await SavedMealService.applySavedMealToDay(
      parseInt(id),
      fecha ? new Date(fecha) : undefined
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error al aplicar el plato' });
  }
};

export const deleteSavedMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await SavedMealService.deleteSavedMeal(parseInt(id));
    res.json({ success: true, data: { mensaje: 'Plato eliminado correctamente' } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error al eliminar el plato' });
  }
};
