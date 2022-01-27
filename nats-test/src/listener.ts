import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// ClientID - must be unique with multiple instances/publishers/listeners
const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // .setManualAckMode(true) - NATs no longer auto ackownledge the message was received. 
  // if no acknowledge was recieved, after 30s it will publish again.
  const options = stan.subscriptionOptions().setManualAckMode(true);

  // listen to ticket:created topic/event with a Queue Group to avoid receiving duplicated message
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    // check received data type
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data:${data}`);
    }

    // manually acknowledge the message was received
    msg.ack();

  });
});
