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

  // listen to ticket:created topic/event
  const subscription = stan.subscribe('ticket:created');

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    // check received data type
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data:${data}`);
    }
  });
});
