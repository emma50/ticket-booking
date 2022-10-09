import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@e50tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket the order is trying not to reserve
    const ticket = await Ticket.findById(data.ticket.id)

    // if there is no ticket throw an error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    try {
      // Mark the ticket as not reserved by removing it's orderId property
      ticket.set({ orderId: undefined })

      // Save the ticket
      await ticket.save()

      // publish a ticket-update event
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      })

      // ack the message
      msg.ack()
    } catch(err) {
      console.error(`Error: ${err}`)
    }
  }
}