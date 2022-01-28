import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message): void {
    console.log('Event data!', data);

    // business logic, if fails, just let it times out 
    // so it will queue back to the NATS streaming server and resend again

    // if success, acknowledge message received back to NATS since the manual subscription option was enabled
    msg.ack();
  }
}