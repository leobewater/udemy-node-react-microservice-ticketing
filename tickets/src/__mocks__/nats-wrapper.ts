// mock the natsWrapper for Jest tests without connecting to the actual NATS server
export const natsWrapper = {
  client: {
    // use jest.fn().mockImplementation() so we can write assertion in our tests
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
