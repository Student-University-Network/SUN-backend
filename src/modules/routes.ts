import authRoutes from '@/modules/auth/auth.routes';
import userRoutes from '@/modules/user/user.routes';

import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

export default router;
