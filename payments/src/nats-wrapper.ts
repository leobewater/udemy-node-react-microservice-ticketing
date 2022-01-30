import nats, { Stan } from 'node-nats-streaming';

// create a wrapper to share a singleton client via the app
class NatsWrapper {
  // "?" = this property will be initialized later
  private _client?: Stan;

  // use Typescript getter
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    // return a Promise
    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      // fail to connect, return reject
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
