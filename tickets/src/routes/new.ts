import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@mmb8npm/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

// add requireAuth middleware
router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').trim().not().isEmpty().withMessage('Title is required'),

    body('price').isFloat({ gt: 0 }).withMessage('Price must be great than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    // save ticket to mongodb
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
