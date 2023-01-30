import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import { loginInput, registerInput } from '@/modules/auth/auth.schema';
import { createUser } from '@/modules/auth/auth.service';
import { ApiError } from '@/utils/ApiError';
import log from '@/utils/logger';
import { Request, Response } from 'express';

export async function loginHandler(
	req: Request<{}, {}, loginInput>,
	res: Response,
) {
	res.json({
		message: 'OK',
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
