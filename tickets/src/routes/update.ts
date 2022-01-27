import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@mmb8npm/common';
import { Ticket } from '../models/ticket';

const route = express.Router();

route.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').trim().not().isEmpty().withMessage('Title is required'),

    body('price').isFloat({ gt: 0 }).withMessage('Price must be great than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    // check ticket userId with the logged current user id
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // update the ticket
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    res.send(ticket);
  }
);

export { route as updateTicketRouter };
