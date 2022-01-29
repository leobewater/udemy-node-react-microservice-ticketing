import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@mmb8npm/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  readonly queueGroupName = queueGroupName;

  // update ticket saved in orders service
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // update ticket
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    // acknowledge receiving the message
    msg.ack();
  }
}
