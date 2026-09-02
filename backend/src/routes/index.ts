import { Router } from 'express';
import foodRoutes from './food.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/foods', foodRoutes);
router.use('/users', userRoutes);

// Ejemplo de endpoint base para Historial Diario (pendiente)
router.get('/daily-logs', (req, res) => {
  res.json({ success: true, data: [] });
});

export default router;
