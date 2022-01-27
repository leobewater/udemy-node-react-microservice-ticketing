import nats, { Message } from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', '123', {
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
      console.log(
        `Received event #${msg.getSequence()}, with data:${data}`
      );
    }
  });
});
