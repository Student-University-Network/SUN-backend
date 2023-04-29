import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	getAnnouncementsHandler,
	setAnnouncementHandler,
	getProgramListHandler,
} from '@/modules/announcements/announcements.controller';
import { setAnnouncementSchema } from '@/modules/announcements/announcements.schema';
import validateRequest from '@/utils/validateRequest';
import validateUserRole from '@/utils/validateUserRole';
import { Role } from '@prisma/client';
import { Router } from 'express';

const router = Router();

router.get(
	'/list',
	verifyJWT,
	validateUserRole([Role.STUDENT, Role.FACULTY]),
	getAnnouncementsHandler,
);

router.get(
	'/program-list',
	verifyJWT,
	validateUserRole([Role.ADMIN, Role.FACULTY]),
	getProgramListHandler,
);

router.post(
	'/announce',
	verifyJWT,
	validateUserRole([Role.FACULTY, Role.ADMIN]),
	validateRequest(setAnnouncementSchema),
	setAnnouncementHandler,
);

export default router;
