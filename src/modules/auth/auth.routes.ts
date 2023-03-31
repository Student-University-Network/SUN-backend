import {
	loginHandler,
	logoutHandler,
	refreshTokenHandler,
	registerHandler,
	registerBatchHandler,
} from '@/modules/auth/auth.controller';
import { verifyJWT } from '@/modules/auth/auth.middleware';
import {
	loginSchema,
	registerBatchSchema,
	registerSchema,
} from '@/modules/auth/auth.schema';
import validateRequest from '@/utils/validateRequest';
import validateUserRole from '@/utils/validateUserRole';
import { Role } from '@prisma/client';
import { Router } from 'express';

const router = Router();

router.post('/login', validateRequest(loginSchema), loginHandler);
router.post(
	'/register',
	verifyJWT,
	validateRequest(registerSchema),
	validateUserRole([Role.ADMIN]),
	registerHandler,
);
router.post(
	'/register-batch',
	verifyJWT,
	validateRequest(registerBatchSchema),
	validateUserRole([Role.ADMIN]),
	registerBatchHandler,
);
router.get('/refreshToken', refreshTokenHandler);
router.post('/logout', logoutHandler);

router.get('/test', verifyJWT, (req, res) => {
	res.send({
		message: 'OK',
	});
});

export default router;
