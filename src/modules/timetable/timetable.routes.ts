import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	getFacultyTimetableHandler,
	getTimetableHandler,
	setTimetableHandler,
} from '@/modules/timetable/timetable.controller';
import {
	getTimetableSchema,
	setTimetableSchema,
} from '@/modules/timetable/timetable.schema';
import validateRequest from '@/utils/validateRequest';
import validateUserRole from '@/utils/validateUserRole';
import { Role } from '@prisma/client';
import { Router } from 'express';

const router = Router();

router.get(
	'/faculty',
	verifyJWT,
	validateUserRole([Role.FACULTY]),
	getFacultyTimetableHandler,
);

router.get(
	'/:batchId',
	verifyJWT,
	validateUserRole([Role.STUDENT, Role.ADMIN]),
	validateRequest(getTimetableSchema),
	getTimetableHandler,
);

router.post(
	'/new',
	verifyJWT,
	validateUserRole([Role.ADMIN]),
	validateRequest(setTimetableSchema),
	setTimetableHandler,
);

export default router;
