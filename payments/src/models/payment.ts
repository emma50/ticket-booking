import {
  Schema,
  Model,
  model,
  Document
} from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Create an interface representing the props required to create a payment
interface IPayment {
  orderId: string;
  stripeId: string;
  version: number;
}

// Create an interface representing the props that ends up on a payment
interface PaymentDoc extends Document {
  orderId: string;
  stripeId: string;
  version: number;
}

interface PaymentModel extends Model<PaymentDoc> {
  build(newPayment: IPayment): PaymentDoc;
}

// Create a Schema corresponding to the document interface.
const paymentSchema = new Schema<PaymentDoc>({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
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

paymentSchema.set('versionKey', 'version')
paymentSchema.plugin(updateIfCurrentPlugin)

// extend mongoose schema (paymentSchema) - add a static method
// Create a new Payment
paymentSchema.statics.build = (newPayment: IPayment) => {
  return new Payment(newPayment)
}

// Create a Model.
const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment }