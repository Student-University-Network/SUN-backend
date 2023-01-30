import 'module-alias/register';
import 'dotenv/config';
import app from './app';
import log from '@/utils/logger';
import config from '@/config';

async function startServer() {
	app.listen(config.port, () => {
		log.info('Server running on port: %s', config.port);
	});
}

startServer();
