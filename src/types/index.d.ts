import { JWTPayload } from '@/modules/auth/auth.service';

export {};

declare global {
	namespace Express {
		export interface Request {
			user?: JWTPayload;
		}
	}
}
