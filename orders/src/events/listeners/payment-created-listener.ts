import { Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
  OrderStatus
} from "@e50tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  // in the case of multiple running instances of a listener i.e order service
  // queue-group ensures events are sent to only one instance at a time
  readonly queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)
      
    if (!order) {
      throw new Error('Order not found')
    }

    try {
      order.set({
        status: OrderStatus.Complete
      })
      await order.save()

      msg.ack()
    } catch(err) {
      console.error(`Error: ${err}`)
    }
  }
}