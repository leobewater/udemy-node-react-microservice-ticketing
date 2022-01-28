import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

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

  new TicketCreatedListener(stan).listen();
});

// there is a delay when listener process get terminated before fully shutdown.
// Adjust the heeartbeat value in the server config to minimize the delay.
// handlers for interrupt/terminating the listener process to avoid missing messages/events
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
