import { Schema, Model, model, Document } from 'mongoose';
import { Subjects } from '@e50tickets/common'

export enum EventStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
}

// Create an interface representing a document in MongoDB.
interface ITicket {
  title: string;
  price: number;
  userId: string;
}

interface IEvents {
  name: string;
  data: ITicket; // stores the payload of each different event
  status?: EventStatus;
}

export interface EventModel extends Model<EventDoc> {
  build(newEvent: IEvents): EventDoc;
}

export interface EventDoc extends Document {
  id: string;
  name: string;
  data: {
    title: string,
    price: number,
    userId: string,
  };
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Create a Schema corresponding to the document interface.
const eventSchema = new Schema<EventDoc>({
  name: {
    type: String,
    enum: Object.values(Subjects),
    required: true },
  data: {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    required: true,
    default: EventStatus.PENDING
  }
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.__v

      if (!ret.id) {
        ret.id = ret._id
      }

      delete ret._id
    }
  },
  timestamps: true,
});

// extend mongoose schema (eventSchema) - add a static method
// Create a new event
eventSchema.statics.build = (newEvent: IEvents) => {
  return new Event(newEvent)
}

// Create a Model.
const Event = model<EventDoc, EventModel>('Event', eventSchema);

export { Event }