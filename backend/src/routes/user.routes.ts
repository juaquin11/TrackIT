import { Router } from 'express';
import { getUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getUser);
router.put('/:id', updateUser);

export default router;
