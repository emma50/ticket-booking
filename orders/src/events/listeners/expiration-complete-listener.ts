import { Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus
} from "@e50tickets/common";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  // in the case of multiple running instances of a listener i.e order service
  // queue-group ensures events are sent to only one instance at a time
  readonly queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new Error('Order not found')
    }

    try {
      order.set({ status: OrderStatus.Cancelled })
      await order.save()

      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        version: order.version,
        ticket: {
          id: order.ticket.id,
          price: order.ticket.price,
        }
      })

      msg.ack()
    } catch(err) {
      console.error(`Error: ${err}`)
    }
  }
}