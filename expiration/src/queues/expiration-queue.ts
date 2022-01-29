import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

// after order is created create a new job {orderID} with type 'order:expiration"
// and send to the queueName "order:expiration" for "15mins" before it expired
// send the job to Redis, once the job expired Redis will send the job back to the expirationQueue
// then we can dispatch a expiration:complete with {orderId} event

interface Payload {
  orderId: string;
}

// initialize Queue with QueueName and connect to our Redis Pod with our Payload with {orderId}
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// once the queue job is received in Redis, Redis sends back the job from the expirationQueue
// then dispatch "expiration:complete" event
// reason using redis because it is faster as the data is stored in memory. Redis is also often used to store sessions.
expirationQueue.process(async (job) => {
  console.log(
    'Received returned queued expiration job from Redis for orderId:',
    job.data.orderId
  );

  // dispatch an event expiration:complete
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
