import mongoose, {
  Schema,
  Model,
  model,
  Document
} from 'mongoose';
import { OrderStatus } from '@e50tickets/common'
import { TicketDoc } from './ticket'

// Create an interface representing the props required to create an order
interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// Create an interface representing the props that ends up on an order
interface OrderDoc extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends Model<OrderDoc> {
  build(newOrder: IOrder): OrderDoc;
}

// Create a Schema corresponding to the document interface.
const orderSchema = new Schema<OrderDoc>({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
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
  }
});

// extend mongoose schema (OrderSchema) - add a static method
// Create a new Order
orderSchema.statics.build = (newOrder: IOrder) => {
  return new Order(newOrder)
}

// Create a Model.
const Order = model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus }