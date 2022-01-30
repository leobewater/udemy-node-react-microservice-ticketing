// mock stripe function that being used
export const stripe = {
  charges: {
    // return a promise object
    create: jest.fn().mockReturnValue({}),
  },
};
