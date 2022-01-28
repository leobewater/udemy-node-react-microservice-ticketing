import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { randomBytes } from 'crypto';

// connect mongo and start server
// latest node must have an async function to start, await can't be at the top level
const start = async () => {
  // check env vars existence
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    // "ticketing" is from the -cid config in nats-depl.yaml
    await natsWrapper.connect(
      'ticketing',
      randomBytes(4).toString('hex'),
      'http://nats-srv:4222'
    );

    // handle NATS connection termination
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // using deployment host name and connect to auth db
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
