import { ApiError } from '@/utils/ApiError';
import { Request, Response, NextFunction } from 'express';
import config from '@/config';
import logger from '@/utils/logger';
import { Prisma } from '@prisma/client';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';

const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof ApiError) {
		//log error
		logger.error(err);

		return res.status(err.statusCode).send({
			type: err.name,
			statusCode: err.statusCode,
			message: err.message,
			stack:
				config.env === 'development'
					? `${err.stack?.toString()}`
					: undefined,
		});
	}

	res.status(500).send({
		type: err.name,
		statusCode: 500,
		message: err.message,
		stack:
			config.env === 'development'
				? `${err.stack?.toString()}`
				: undefined,
	});
	next(err);
};

export const prismaOperation = async (operation: () => void) => {
	try {
		const result = await operation();
		return result;
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			throw new ApiError(
				'Failed to find resource',
				HttpStatusCode.BAD_REQUEST,
				e.message,
			);
		} else {
			throw e;
		}
	}
};

export default errorHandler;
