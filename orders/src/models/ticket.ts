import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// duplicated model from Ticket service.
// DON'T put this in the Common library since it's slight different than Tickets Service -> Ticket Model.
interface TicketAttrs {
  id: string; // foreign Ticket ID
  title: string;
  price: number;
}

// add isReserved method to TicketDoc
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  // add statics custom function to receive event and return a promise either TicketDoc or Null
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

// tell mongoose to set/track the Order's Ticket version to avoid out of order concurrency issues
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// update the version number using the pre-save hook instead of using the plugin mongoose-update-if-current
// but in the ticket-updated-listener, need to manually add the version: version in the set/save payload
// ticketSchema.pre('save', function (done) {
//   // @ts-ignore
//   this.$where = {
//     version: this.get('version') - 1,
//   };

//   done();
// });

// this query will find the Ticket By ID and the Ticket previous version number
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// override mongodb doc "_id" with the received foreign Ticket Id.
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
