import mongoose from 'mongoose';

// Typescript interfaces
interface OrderAttrs {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc; // reference ticket model
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: string;
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
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }
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
