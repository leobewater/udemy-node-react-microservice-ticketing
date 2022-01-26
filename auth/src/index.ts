import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

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

// connect mongo and start server
// latest node must have an async function to start, await can't be at the top level
const start = async () => {
  try {
    // using deployment host name and connect to auth db
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Conncted to mongodb');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
