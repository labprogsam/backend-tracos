import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler, requestHandler, notFoundHandler } from './handlers/index.js';
import { user, auth, tags, report, tattooArtists, notifications, images, customers, bookings, artistInformations } from './routes/index.js';

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
app.use(tags);
app.use(tattooArtists);
app.use(artistInformations);
app.use(report);
app.use(notifications);
app.use(images);
app.use(customers);
app.use(bookings);

// ================ HANDLERS ================ //
app.use(errorHandler);
app.use(notFoundHandler);
app.use(requestHandler);

export default app;
