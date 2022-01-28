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

  // when disconnect/terminate
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  // .setManualAckMode(true) - NATs no longer auto ackownledge the message was received.
  // if no acknowledge was recieved, after 30s it will publish again.
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true) // manually acknowledge recieving the event
    .setDeliverAllAvailable() // redeliver all events (don't use it alone)
    .setDurableName('accounting-service'); // after acknowledge, NATs store this Name in the event history

  // listen to ticket:created topic/event with a Queue Group to avoid receiving duplicated message
  const subscription = stan.subscribe(
    'ticket:created', // channel
    'orders-service-queue-group', // queue group
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

// there is a delay when listener process get terminated before fully shutdown.
// Adjust the heeartbeat value in the server config to minimize the delay.
// handlers for interrupt/terminating the listener process to avoid missing messages/events
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
