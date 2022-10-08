import { Schema, Model, model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Create an interface representing a document in MongoDB.
interface ITicket {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends Model<TicketDoc> {
  build(newTicket: ITicket): TicketDoc;
}

interface TicketDoc extends Document {
  title: string,
  price: number,
  userId: string;
  orderId?: string;
  version: number;
}

// Create a Schema corresponding to the document interface.
const ticketSchema = new Schema<TicketDoc>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  userId: { type: String, required: true },
  orderId: { type: String }
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
  return new Ticket(newTicket)
}

// Create a Model.
const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket }