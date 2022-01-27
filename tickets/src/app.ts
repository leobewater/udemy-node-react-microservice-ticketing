import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mmb8npm/common';

import { createTicketRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    // disable encryption on cookie
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

// routes
app.use(currentUser);
app.use(createTicketRouter);
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// middlewares
app.use(errorHandler);

export { app };
