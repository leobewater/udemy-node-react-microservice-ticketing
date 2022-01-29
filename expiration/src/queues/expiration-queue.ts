import Queue from 'bull';

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

// when Redis sends back the job to this expirationQueue
expirationQueue.process(async (job) => {
  console.log(
    'I want to publish an expiration:complete event for orderId',
    job.data.orderId
  );

  // dispatch an event expiration:complete
});

export { expirationQueue };
