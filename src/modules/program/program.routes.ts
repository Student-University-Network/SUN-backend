import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	createProgramHandler,
	getProgramHandler,
	getProgramListHandler,
	updateProgramHandler,
	getBatchDetailsHandler,
} from '@/modules/program/program.controller';
import {
	createProgramSchema,
	getProgramSchema,
	updateProgramSchema,
	getBatchSchema,
} from '@/modules/program/program.schema';
import validateRequest from '@/utils/validateRequest';
import validateUserRole from '@/utils/validateUserRole';
import { Role } from '@prisma/client';
import { Router } from 'express';

const router = Router();

// TODO : // Add FACULTY role when professors are assigned to courses

router.get(
	'/list',
	verifyJWT,
	validateUserRole([Role.ADMIN]),
	getProgramListHandler,
);

router.get(
	'/:programId',
	verifyJWT,
	validateUserRole([Role.ADMIN, Role.STUDENT]),
	validateRequest(getProgramSchema),
	getProgramHandler,
);

router.post(
	'/new',
	verifyJWT,
	validateUserRole([Role.ADMIN]),
	validateRequest(createProgramSchema),
	createProgramHandler,
);

router.put(
	'/:programId',
	verifyJWT,
	validateUserRole([Role.ADMIN, Role.STUDENT]),
	validateRequest(updateProgramSchema),
	updateProgramHandler,
);

router.get(
	'/batch/:batchId',
	verifyJWT,
	validateUserRole([Role.ADMIN, Role.FACULTY]),
	validateRequest(getBatchSchema),
	getBatchDetailsHandler,
);

export default router;
