import { Publisher, Subjects, OrderCancelledEvent } from '@mmb8npm/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}