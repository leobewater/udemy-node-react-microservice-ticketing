import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@mmb8npm/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

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
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
// handle async error using next() without the express-async-errors plugin
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// });

// 404 error for all actions and async with plugin express-async-errors
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// middlewares
app.use(errorHandler);

export { app };
