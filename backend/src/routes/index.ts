import { Router } from 'express';
import foodRoutes from './food.routes';
import userRoutes from './user.routes';
import plannerRoutes from './planner.routes';

const router = Router();

router.use('/foods', foodRoutes);
router.use('/users', userRoutes);
router.use('/planner', plannerRoutes);

// Ejemplo de endpoint base para Historial Diario (pendiente)
router.get('/daily-logs', (req, res) => {
  res.json({ success: true, data: [] });
});

export default router;
