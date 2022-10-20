import { Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from "@e50tickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  // in the case of multiple running instances of a listener i.e order service
  // queue-group ensures events are sent to only one instance at a time
  readonly queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price } = data
    
    const ticket = await Ticket.findByEvent(data)
  
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    
    try {
      ticket.set({
        title,
        price,
      })
  
      await ticket.save()
      msg.ack()
    } catch(err: any) {
      console.error(`Error: ${err}`)
    }
  }
}