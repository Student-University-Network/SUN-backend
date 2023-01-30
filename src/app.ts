import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import routes from '@/modules/routes';
import config from '@/config';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());
app.use(
	cors({
		credentials: true,
	}),
);
app.use(express.json());
app.use(compression());
app.use(cookieParser());

// all application routes goes here
app.use(config.api.prefix, routes);

// healthcheck
app.get('/healthcheck', (req, res) => res.status(200).send({ message: 'OK' }));

// todo error handler 404 handler

export default app;
