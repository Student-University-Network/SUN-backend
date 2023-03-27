import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';

const validateUserRole =
	(requiredRoles: Array<Role>) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			if (!requiredRoles.some((role) => role === req.user?.User.role)) {
				return res.sendStatus(HttpStatusCode.FORBIDDEN);
			}
			next();
		} catch (err: any) {
			return res.status(400).send(err.errors);
		}
	};

export default validateUserRole;
