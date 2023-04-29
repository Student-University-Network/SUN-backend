import { Router } from 'express';
import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	getUsersListHandler,
	getUserDetailsHandler,
	assignProfessorHandler,
	getBatchDetailsHandler,
	saveBatchDetailsHandler,
} from '@/modules/admin/admin.controller';

import { Role } from '@prisma/client';
import validateUserRole from '@/utils/validateUserRole';
import validateRequest from '@/utils/validateRequest';
import {
	AssignProfessorSchema,
	getBatchSchema,
	SaveBatchDetailsSchema,
} from '@/modules/admin/admin.schema';
import { saveBatchDetails } from '@/modules/admin/admin.service';

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

router.get(
	'/batch/:batchId',
	verifyJWT,
	validateUserRole([Role.ADMIN, Role.FACULTY]),
	validateRequest(getBatchSchema),
	getBatchDetailsHandler,
);

router.post(
	'/batch',
	verifyJWT,
	validateUserRole([Role.ADMIN]),
	validateRequest(SaveBatchDetailsSchema),
	saveBatchDetailsHandler,
);

export default router;
