import { Router } from 'express';
import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	changePasswordHandler,
	getProfileHandler,
	updateProfileHandler,
} from '@/modules/user/user.controller';
import {
	changePasswordSchema,
	updateProfileSchema,
} from '@/modules/user/user.schema';
import validateRequest from '@/utils/validateRequest';

const router = Router();

router.get('/profile', verifyJWT, getProfileHandler);
router.put(
	'/profile',
	verifyJWT,
	validateRequest(updateProfileSchema),
	updateProfileHandler,
);

router.put(
	'/password',
	verifyJWT,
	validateRequest(changePasswordSchema),
	changePasswordHandler,
);

export default router;
