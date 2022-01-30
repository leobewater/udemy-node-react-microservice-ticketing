import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@mmb8npm/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('orderId').notEmpty().withMessage('Order Id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    console.log("Going to Charge Payment now");

    // charge the payment via Stripe
    await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
      description: `Microservice Test Charge Order ID: ${orderId}`,
    });

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
