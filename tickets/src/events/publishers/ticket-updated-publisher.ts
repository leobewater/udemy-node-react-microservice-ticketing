import { Publisher, Subjects, TicketUpdatedEvent } from '@mmb8npm/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}