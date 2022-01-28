import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

// TODO - add additional request body validation, authenciation, event, order content tests (look at tickets service)

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  // create a ticket and save to db
  const ticket = Ticket.build({
    title: 'concern',
    price: 20,
  });
  await ticket.save();

  // create an existing order with a ticket save to db
  const order = Order.build({
    userId: 'ABC123',
    status: OrderStatus.Created,
    expiresAt: new Date(), // this expires right away, it's ok since we are not testing it now
    ticket,
  });
  await order.save();

  // create new order but ticket already reserved
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  // create a ticket and save to db
  const ticket = Ticket.build({
    title: 'concern',
    price: 20,
  });
  await ticket.save();

  // create new order
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo('emits an order created event');