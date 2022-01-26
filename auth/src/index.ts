import mongoose from 'mongoose';
import { app } from './app';

// connect mongo and start server
// latest node must have an async function to start, await can't be at the top level
const start = async () => {
  // check env vars exist
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

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
