import {
	loginHandler,
	refreshTokenHandler,
	registerHandler,
} from '@/modules/auth/auth.controller';
import { verifyJWT } from '@/modules/auth/auth.middleware';
import { loginSchema, registerSchema } from '@/modules/auth/auth.schema';
import validateRequest from '@/utils/validateRequest';
import { Router } from 'express';

const router = Router();

router.post('/login', validateRequest(loginSchema), loginHandler);
router.post('/register', validateRequest(registerSchema), registerHandler);
router.get('/refreshToken', refreshTokenHandler);

router.get('/test', verifyJWT, (req, res) => {
	res.send({
		message: 'OK',
	});
});

export default router;
