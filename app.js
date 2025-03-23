import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler, requestHandler, notFoundHandler } from './handlers/index.js';
import { user, auth } from './routes/index.js';

// ================ APPLICATION ================ //
const app = express();

// ------------ THIRD PARTY MIDDLEWARES ------------ //
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// ------------ ROUTES ------------ //
app.use(user);
app.use(auth);

// ================ HANDLERS ================ //
app.use(errorHandler);
app.use(notFoundHandler);
app.use(requestHandler);

export default app;
