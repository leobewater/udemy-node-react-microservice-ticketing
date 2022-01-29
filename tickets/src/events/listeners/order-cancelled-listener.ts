import { Listener, OrderCancelledEvent, Subjects } from '@mmb8npm/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  readonly queueGroupName = queueGroupName;

  onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    
    {
      id: string;
      version: number;
      ticket: {
        id: string;
      }
    }
  }
}
