import { Schema, Model, model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order'

// Create an interface representing a document in MongoDB.
interface ITicket {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends Document {
  title: string,
  price: number,
  version: number,
  isReserved(): Promise<boolean>
}
interface TicketModel extends Model<TicketDoc> {
  build(newTicket: ITicket): TicketDoc;
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

// Create a Schema corresponding to the document interface.
const ticketSchema = new Schema<TicketDoc>({
  title: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.__v

      if (!ret.id) {
        ret.id = ret._id
      }

      delete ret._id
    }
  }
});

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

// extend mongoose schema (ticketSchema) - add a static method
// Create a new ticket
ticketSchema.statics.build = (newTicket: ITicket) => {
  return new Ticket({
    _id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price
  })
}

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    id: event.id,
    version: event.version - 1
  })
}

ticketSchema.methods.isReserved = async function() {
  // this === ticket document
  // Check to see that the order is not already reserved
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  })

  return !!existingOrder
}

// Create a Model.
const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket }