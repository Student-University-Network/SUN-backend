import { Router } from 'express';
import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	getUsersListHandler,
	getUserDetailsHandler,
	assignProfessorHandler,
} from '@/modules/admin/admin.controller';

import { Role } from '@prisma/client';
import validateUserRole from '@/utils/validateUserRole';
import validateRequest from '@/utils/validateRequest';
import { AssignProfessorSchema } from '@/modules/admin/admin.schema';

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

router.post(
	'/assign-professor',
	verifyJWT,
	validateUserRole([Role.ADMIN]),
	validateRequest(AssignProfessorSchema),
	assignProfessorHandler,
);

export default router;
