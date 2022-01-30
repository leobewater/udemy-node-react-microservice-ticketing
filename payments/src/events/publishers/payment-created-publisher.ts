import { Subjects, Publisher, PaymentCreatedEvent } from '@mmb8npm/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
