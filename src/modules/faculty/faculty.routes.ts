import { Router } from 'express';
import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	getCoursesListHandler,
	getCourseDetailsHandler,
} from '@/modules/faculty/faculty.controller';

import { Role } from '@prisma/client';
import validateUserRole from '@/utils/validateUserRole';

const router = Router();

router.get(
	'/courses-list',
	verifyJWT,
	validateUserRole([Role.FACULTY]),
	getCoursesListHandler,
);

router.get(
	'/course-details',
	verifyJWT,
	validateUserRole([Role.FACULTY]),
	getCourseDetailsHandler,
);

export default router;
