import { Router } from 'express';
import { getAllFoods, getFoodById, createFood } from '../controllers/food.controller';

const router = Router();

router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.post('/', createFood);

export default router;
