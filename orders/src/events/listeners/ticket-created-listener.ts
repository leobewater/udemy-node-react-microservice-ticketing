import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@mmb8npm/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

  // using queueGroupName to avoid receiving duplicated messages
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    // recieve ticket created event
    const { id, title, price } = data;

    // save ticket to Orders collection, make sure using saving the foreign Ticket ID from tickets service as the _id, check ticket model
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
