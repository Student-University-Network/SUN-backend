import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	startAttendanceHandler,
	markAttendanceHandler,
	getAttendanceReportHandler,
} from '@/modules/attendance/attendance.controller';
import {
	startAttendanceSchema,
	markAttendanceSchema,
	getAttendanceReportSchema,
} from '@/modules/attendance/attendance.schema';
import validateRequest from '@/utils/validateRequest';
import validateUserRole from '@/utils/validateUserRole';
import { Role } from '@prisma/client';
import { Router } from 'express';

const router = Router();

router.post(
	'/start',
	verifyJWT,
	validateUserRole([Role.FACULTY]),
	validateRequest(startAttendanceSchema),
	startAttendanceHandler,
);

router.post(
	'/mark',
	verifyJWT,
	validateUserRole([Role.STUDENT]),
	validateRequest(markAttendanceSchema),
	markAttendanceHandler,
);

router.get(
	'/report',
	verifyJWT,
	validateUserRole([Role.FACULTY, Role.STUDENT]),
	validateRequest(getAttendanceReportSchema),
	getAttendanceReportHandler,
);

export default router;
