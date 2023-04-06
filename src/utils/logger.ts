import logger from 'pino';
import config from '@/config';
import { Request, Response, NextFunction } from 'express';

const level = config.logger.level;

const log = logger({
	level,
	base: {
		pid: false,
	},
});

export const logRequestInfo = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	res.on('finish', () =>
		log.info(`[${req.method}] ${res.statusCode} : ${req.url}`),
	);
	next();
};

export default log;
