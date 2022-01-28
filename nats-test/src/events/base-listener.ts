// TS abstract class
import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

// make it a generic class
export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000; // 5s

  constructor(client: Stan) {
    this.client = client;
  }

  // .setManualAckMode(true) - NATs no longer auto ackownledge the message was received.
  // if no acknowledge was recieved, after 30s it will publish again.
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // redeliver all events (don't use it alone)
      .setManualAckMode(true) // manually acknowledge recieving the event
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); // after acknowledge, NATs store this Name in the event history
  }

  listen() {
    // listen to ticket:created topic/event with a Queue Group to avoid receiving duplicated message
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  // parse received message
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
