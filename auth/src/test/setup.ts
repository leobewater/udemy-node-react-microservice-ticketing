import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;

// create in-memory mongodb server before all tests
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  
  // await mongoose.connect(mongoUri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  await mongoose.connect(mongoUri);
});

// delete all database before running each test
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
