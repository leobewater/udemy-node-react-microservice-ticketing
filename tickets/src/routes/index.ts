import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  // return only new/unreserved tickets
  const tickets = await Ticket.find({ orderId: undefined });

  res.send(tickets);
});

export { router as indexTicketRouter };
