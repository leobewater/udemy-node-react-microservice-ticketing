import { Message } from 'node-nats-streaming';
import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  OrderStatus,
  NotFoundError,
} from '@mmb8npm/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  // using queueGroupName to avoid receiving duplicated messages
  readonly queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    // recieve payment created event
    const { id, orderId, stripeId } = data;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    // mark order as completed
    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
