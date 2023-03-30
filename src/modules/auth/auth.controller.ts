import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	loginInput,
	registerBatchInput,
	registerInput,
} from '@/modules/auth/auth.schema';
import {
	createUser,
	login,
	generateAccessToken,
	createBatchUsers,
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

export async function registerBatchHandler(
	req: Request<{}, {}, registerBatchInput>,
	res: Response,
) {
	const usersFile = req.file;
	if (!usersFile)
		res.status(HttpStatusCode.BAD_REQUEST).json({
			status: Status.ERROR,
			message: 'No CSV file uploaded',
		});

	const usersCsv = await createBatchUsers(req.body, usersFile!);

	res.writeHead(200, [
		['Content-Type', 'text/csv'],
		['Content-Disposition', "attachment; filename='usersFile.csv'"],
	]);
	res.end(usersCsv);
}

export async function refreshTokenHandler(req: Request, res: Response) {
	const refreshToken = req.cookies['x-refresh'];

	if (!refreshToken) return res.sendStatus(HttpStatusCode.UNAUTHORIZED);

	const accessToken = await generateAccessToken(refreshToken);

	if (!accessToken) return res.sendStatus(HttpStatusCode.UNAUTHORIZED);

	log.debug('Access Token Generated %s', accessToken);
	res.status(HttpStatusCode.OK).json({
		accessToken,
	});
}

export async function logoutHandler(req: Request, res: Response) {
	// reset x-refresh cookie
	res.cookie('x-refresh', '', {
		httpOnly: true,
		maxAge: 1,
	});

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		message: 'Logged out successfully',
	});
}
