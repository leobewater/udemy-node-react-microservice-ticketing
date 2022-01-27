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

route.put('/api/tickets/:id', async (req: Request, res: Response) => {});

export { route as updateTicketRouter };
