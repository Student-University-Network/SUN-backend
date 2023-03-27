import authRoutes from '@/modules/auth/auth.routes';
import userRoutes from '@/modules/user/user.routes';
import programRoutes from '@/modules/program/program.routes';

import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/program', programRoutes);

export default router;
