import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// ClientID - must be unique with multiple instances/publishers/listeners
const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

// onConnect event
stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, ()=> {
    console.log('Event ticket:created published');
  });
  
});
