import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

// TODO - add additonal test for authentication, order Id validation etc.

it('marks an order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // make a request to build an order with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to delete/cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // we can fetch the order by the show route or directly from database
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.id).toEqual(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
