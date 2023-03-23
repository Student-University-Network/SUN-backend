import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import log from '@/utils/logger';
import config from '@/config';
import { JWTPayload } from '@/modules/auth/auth.service';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';

// verify normal student
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
	// check if x-refresh cookie is set or not (temp fix for now)
	const refresh = req.cookies['x-refresh'];
	if (!refresh) return res.sendStatus(HttpStatusCode.UNAUTHORIZED);

	// get auth header
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.sendStatus(HttpStatusCode.FORBIDDEN);
	log.debug(authHeader);

	const token = authHeader.split(' ')[1];

	// very jwt token
	jwt.verify(token, config.secrets.accessToken, (err, decoded) => {
		if (err) return res.sendStatus(HttpStatusCode.FORBIDDEN);
		req.user = decoded as JWTPayload;
		log.debug(req.user);
		next();
	});
};
