import { Router } from 'express';
import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	getUsersListHandler,
	getUserDetailsHandler,
} from '@/modules/admin/admin.controller';

import { Role } from '@prisma/client';
import validateUserRole from '@/utils/validateUserRole';

const router = Router();

router.get(
	'/user-list',
	verifyJWT,
	validateUserRole([Role.ADMIN]),
	getUsersListHandler,
);

router.get(
	'/user/:userId',
	verifyJWT,
	validateUserRole([Role.ADMIN]),
	getUserDetailsHandler,
);

export default router;
