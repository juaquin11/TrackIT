import { Router } from 'express';
import { generatePlan } from '../controllers/planner.controller';

const router = Router();

router.post('/generate', generatePlan);

export default router;
