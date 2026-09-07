import { Router } from 'express';
import {
  getAllSavedMeals,
  createSavedMeal,
  applySavedMeal,
  deleteSavedMeal
} from '../controllers/savedmeal.controller';

const router = Router();

router.get('/', getAllSavedMeals);
router.post('/', createSavedMeal);
router.post('/:id/apply', applySavedMeal);
router.delete('/:id', deleteSavedMeal);

export default router;
