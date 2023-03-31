import { Router } from 'express';
import { verifyJWT } from '@/modules/auth/auth.middleware';
import { getUsersListHandler } from '@/modules/admin/admin.controller';

import { Role } from '@prisma/client';
import validateUserRole from '@/utils/validateUserRole';

const router = Router();

router.get(
	'/user-list',
	verifyJWT,
	validateUserRole([Role.ADMIN]),
	getUsersListHandler,
);

export default router;
