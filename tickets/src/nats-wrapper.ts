import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // "?" = this property will be initialized later
  private _client?: Stan;

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    // return a Promise
    return new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      // fail to connect, return reject
      this._client!.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
