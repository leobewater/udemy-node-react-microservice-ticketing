import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  // need to send returned cookie to the second request since supertest doesn't carry cookie like Postman
  const cookie = await global.signin();

  // get current user by attaching cookie
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(400);

  // console.log(response.body); // { currentUser: null }

  // check currentUser response
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
