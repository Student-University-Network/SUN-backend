import { ApiError } from '@/utils/ApiError';
import { Request, Response, NextFunction } from 'express';
import config from '@/config';
import logger from '@/utils/logger';

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
			stack: config.env === 'development' ? err.stack : undefined,
		});
	}

	res.status(500).send({
		type: err.name,
		statusCode: 500,
		message: err.message,
		stack: config.env === 'development' ? err.stack : undefined,
	});
	next(err);
};

export default errorHandler;
