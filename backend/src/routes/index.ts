import { Router } from 'express';

const router = Router();

// Ejemplo de endpoint base para Alimentos
router.get('/foods', (req, res) => {
  res.json({ success: true, data: [] });
});

// Ejemplo de endpoint base para Historial Diario
router.get('/daily-logs', (req, res) => {
  res.json({ success: true, data: [] });
});

export default router;
