import mongoose from 'mongoose';
import { OrderStatus } from '@mmb8npm/common';
import { TicketDoc } from './ticket';

// so we can use import OrderStatus from the models/order
export { OrderStatus };

// Typescript interfaces
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc; // reference ticket model
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc; // reference ticket model
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// Mongoose Schema & Model using JS
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus), // restrict the mongoose value
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// add build function accept OrderAttrs and returns OrderDoc type
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

// mongoose Order model
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
