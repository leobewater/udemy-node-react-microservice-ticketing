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

  onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // { id: string; version: number; status: OrderStatus; userId: string; expiresAt: string; ticket: { id: string; price: number; }; }
  }
}
