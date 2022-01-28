import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

// tell jest to use the mock file in the __mocks__ folder
jest.mock('../../nats-wrapper');

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
  // console.log(response.status);
  // console.log('response.body.currentUser', response.body.currentUser);
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  // send without title
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  // price with neg value
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: -10,
    })
    .expect(400);

  // price at $0
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 0,
    })
    .expect(400);

  // send without price
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  // get all tickets and should return 0 tickets since before each test collection should be empty
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'Ticket Title';
  // create ticket
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

    // make sure a ticket was saved to database
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    // check ticket content
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].userId).not.toBeNull();
});
