import { Listener, OrderCreatedEvent, Subjects } from "@e50tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    try {
      // Create an order
      const order = await Order.build({
        id: data.id,
        price: data.ticket.price,
        status: data.status,
        userId: data.userId,
        version: data.version
      })

      // Save the order
      await order.save()
      // ack the message
      msg.ack()
    } catch(err) {
      console.error(`Error: ${err}`)
    }
  }
}