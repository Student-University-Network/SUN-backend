import authRoutes from '@/modules/auth/auth.routes';
import userRoutes from '@/modules/user/user.routes';
import programRoutes from '@/modules/program/program.routes';
import adminRoutes from '@/modules/admin/admin.routes';
import facultyRoutes from '@/modules/faculty/faculty.routes';

import { Router } from 'express';
import { logRequestInfo } from '@/utils/logger';

const router = Router();

router.use(logRequestInfo);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/program', programRoutes);
router.use('/admin', adminRoutes);
router.use('/faculty', facultyRoutes);

export default router;
