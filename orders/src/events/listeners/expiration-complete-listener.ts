import { Message } from 'node-nats-streaming';
import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from '@mmb8npm/common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  // using queueGroupName to avoid receiving duplicated messages
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }

    // skip cancelling complete orders
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    // change order status to cancelled as it has expired
    // leave the ticket associated with the order so we can reference/run report in the future
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // dispatch order cancel event
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
