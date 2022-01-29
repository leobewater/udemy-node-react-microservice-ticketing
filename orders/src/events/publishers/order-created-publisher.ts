import { Publisher, Subjects, OrderCreatedEvent } from '@mmb8npm/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}