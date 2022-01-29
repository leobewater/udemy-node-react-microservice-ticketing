import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // save the ticket to db
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket and version number should be 1
  await firstInstance!.save();

  // save the second fetched ticket and expect an error since it has an outdated version number
  try {
    await secondInstance!.save();

    // it shows error:
    // VersionError: No matching document found for id "61f534c44cb22a5d09c275a6" version 0 modifiedPaths "price"
    // to see the error: remove the try catch block
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});
