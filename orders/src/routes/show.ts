import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@mmb8npm/common';
import { body } from 'express-validator';
import { Order } from '../models/order';

const router = express.Router();

router.get(
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
    /*
    // you can find order with id and userid but you won't be able to throw 401 error
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.currentUser!.id,
    }).populate('ticket')
    */

    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
