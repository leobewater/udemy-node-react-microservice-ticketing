import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@mmb8npm/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const {} = data; 
    // reserving the ticket
    // need to lock down the ticket after an order is created so no more changes can be made
    // ticket and order has one-to-one relationship
    // save orderID to ticket instead of saving the locked flag

    // {
    //   id: string;
    //   version: number;
    //   status: OrderStatus;
    //   userId: string;
    //   expiresAt: string;
    //   ticket: {
    //     id: string;
    //     price: number;
    //   }
    // }
  }
}
