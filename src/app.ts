import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(compression());
app.use(cors());
app.use(helmet());

export default app;
