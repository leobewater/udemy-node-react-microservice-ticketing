import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@mmb8npm/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  // reserve the ticket by saving the order id to the ticket
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark the ticket as being reserved by setting its orderId perperty
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();

    // dispatch the ticket updated event to avoid ticket.version out-of-sync between the orders and tickets services
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}
