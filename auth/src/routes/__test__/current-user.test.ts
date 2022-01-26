import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  // register user
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // need to send returned cookie to the second request since supertest doesn't carry cookie like Postman
  const cookie = authResponse.get('Set-Cookie');

  // get current user by attaching cookie
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  // console.log(response.body); // { currentUser: null }

  // check currentUser response
  expect(response.body.currentUser.email).toEqual('test@test.com');
});
