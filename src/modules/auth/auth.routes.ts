import { loginHandler, registerHandler } from '@/modules/auth/auth.controller';
import { loginSchema, registerSchema } from '@/modules/auth/auth.schema';
import validateRequest from '@/utils/validateRequest';
import { Router } from 'express';

const router = Router();

router.post('/login', validateRequest(loginSchema), loginHandler);
router.post('/register', validateRequest(registerSchema), registerHandler);

export default router;
