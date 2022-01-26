import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;

// create in-memory mongodb server before all tests
beforeAll(async () => {
  // hardcode env vars for testing
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

// delete all database collections before running each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// stop mongodb after running all tests
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
