import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@mmb8npm/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // find order by ID and version or create statics function in order model to simplify this
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // update order status
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // ack the message
    msg.ack();
  }
}
