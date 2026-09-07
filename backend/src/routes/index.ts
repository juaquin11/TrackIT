import { Router } from 'express';
import foodRoutes from './food.routes';
import userRoutes from './user.routes';
import plannerRoutes from './planner.routes';
import savedMealRoutes from './savedmeal.routes';

const router = Router();

router.use('/foods', foodRoutes);
router.use('/users', userRoutes);
router.use('/planner', plannerRoutes);
router.use('/saved-meals', savedMealRoutes);

// Ejemplo de endpoint base para Historial Diario (pendiente)
router.get('/daily-logs', (req, res) => {
  res.json({ success: true, data: [] });
});

export default router;

