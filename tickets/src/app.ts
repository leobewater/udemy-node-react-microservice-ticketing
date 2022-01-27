import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@mmb8npm/common';

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
// 404 error for all actions and async with plugin express-async-errors
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// middlewares
app.use(errorHandler);

export { app };
