import logger from 'pino';
import config from '@/config';

const level = config.logger.level;

const log = logger({
	level,
	base: {
		pid: false,
	},
});

export default log;
