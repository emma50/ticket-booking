import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus
} from "@e50tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Cancel an order
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    })

    console.log(order, 'OLDDDDDDDDDDDDDDDDDDDD')

    if (!order) {
      throw new Error('Order not found')
    }

    try {
      order.set({
        status: OrderStatus.Cancelled
      })
  
      // Save an order
      await order.save()
      // ack the message

      console.log(order, 'NEWWWWWWWWWWWWWWWWW')
      msg.ack()
    } catch(err) {
      console.error(`Error: ${err}`)
    }
  }
}