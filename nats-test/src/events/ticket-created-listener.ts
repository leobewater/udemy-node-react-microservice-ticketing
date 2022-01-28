import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message): void {
    console.log('Event data!', data);

    // business logic, if fails, just let it times out
    // so it will queue back to the NATS streaming server and resend again
    console.log(data.name);
    console.log(data.cost);

    // if success, acknowledge message received back to NATS since the manual subscription option was enabled
    msg.ack();
  }
}
