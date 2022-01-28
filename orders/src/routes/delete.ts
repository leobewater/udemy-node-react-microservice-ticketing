import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@mmb8npm/common';
import { body } from 'express-validator';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

// set order status to cancelled instead of deleting the order
router.delete(
  '/api/orders/:orderId',
  [
    body('orderId')
      .notEmpty()
      // check reference orderId structure/format
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('OrderId must be provided'),
  ],
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // dispatch an event saying this was cancelled!

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
