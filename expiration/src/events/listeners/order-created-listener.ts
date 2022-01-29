import { Listener, OrderCreatedEvent, Subjects } from '@mmb8npm/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // when received the order:created event, then queue a job to the Redis server for expiration
    await expirationQueue.add({
      orderId: data.id,
    });

    msg.ack();
  }
}
