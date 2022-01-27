import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@mmb8npm/common';

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
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { router as createTicketRouter };
