import { Listener, OrderCreatedEvent, Subjects } from "@e50tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket the order is trying to reserve
    const ticket = await Ticket.findById(data.ticket.id)

    // if there is no ticket throw an error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    try {
      // Mark the ticket as being reserved by setting it's orderId property
      ticket.set({ orderId: data.id })

      // Save the ticket
      await ticket.save()

      // publish a ticket-update event
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
        orderId: ticket.orderId,
      })

      // ack the message
      msg.ack()
    } catch(err) {
      console.error(`Error: ${err}`)
    }
  }
}