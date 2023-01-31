import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import { loginInput, registerInput } from '@/modules/auth/auth.schema';
import {
	createUser,
	login,
	generateAccessToken,
} from '@/modules/auth/auth.service';
import log from '@/utils/logger';
import { Request, Response } from 'express';

export async function loginHandler(
	req: Request<{}, {}, loginInput>,
	res: Response,
) {
	const { username, accessToken, refreshToken } = await login(req.body);

	res.cookie('x-refresh', refreshToken, {
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000, //1d
	});
	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		message: 'Logged in successfully',
		username,
		accessToken,
	});
}

export async function registerHandler(
	req: Request<{}, {}, registerInput>,
	res: Response,
) {
	const user = await createUser(req.body);

	res.status(HttpStatusCode.CREATED).json({
		status: Status.SUCCESS,
		message: 'User created successfully!',
		user,
	});
}

export async function refreshTokenHandler(req: Request, res: Response) {
	const refreshToken = req.cookies['x-refresh'];
	log.debug(refreshToken);
	const accessToken = await generateAccessToken(refreshToken);

	if (!accessToken) return res.sendStatus(HttpStatusCode.UNAUTHORIZED);

	log.debug('Access Token Generated %s', accessToken);
	res.status(HttpStatusCode.OK).json({
		accessToken,
	});
}
