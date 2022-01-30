import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// tell jest to use the mock file in the __mocks__ folder
jest.mock('../nats-wrapper');

// stripe test key
process.env.STRIPE_KEY = 'sk_test_8u1uYNfQ94Vym28nQFbUOpLt';

let mongo: any;

/*
 * Test hooks
 */
// create in-memory mongodb server before all tests
beforeAll(async () => {
  // hardcode env vars for testing
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

// delete all database collections and jest mocks before running each test
beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// stop mongodb after running all tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

/*
 * Global Test Functions
 */
declare global {
  var signin: (id?: string) => string[];
}

// accept optional id as parameter
global.signin = (id?: string) => {
  // Create a fake cookie, for reference, you can signup and find the currentUser cookie response

  // Build a JWT payload and randomly generate the id. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
