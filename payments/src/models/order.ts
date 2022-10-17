import mongoose, {
  Schema,
  Model,
  model,
  Document
} from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@e50tickets/common'

// Create an interface representing the props required to create an order
interface IOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
}

// Create an interface representing the props that ends up on an order
interface OrderDoc extends Document {
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
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
  price: {
    type: Number,
    required: true
  },
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

// extend mongoose schema (OrderSchema) - add a static method
// Create a new Order
orderSchema.statics.build = (newOrder: IOrder) => {
  return new Order({
    _id: newOrder.id,
    userId: newOrder.userId,
    status: newOrder.status,
    price: newOrder.price,
    version: newOrder.version,
  })
}

// Create a Model.
const Order = model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus }