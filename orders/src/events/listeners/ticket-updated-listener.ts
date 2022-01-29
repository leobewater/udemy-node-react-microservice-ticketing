import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@mmb8npm/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  readonly queueGroupName = queueGroupName;

  // update ticket saved in orders service
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // find with the version number - 1 to match the received Ticket event version number to avoid concurrency out-of-sync issues
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // update ticket
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save(); // once ticket is saved, the version # will match the received Ticket event version number.

    // acknowledge receiving the message
    msg.ack();
  }
}
