import { Message } from "node-nats-streaming";
import { Listener,
  Subjects,
  TicketUpdatedEvent,
  NotFoundError
} from "@e50tickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  // in the case of multiple running instances of a listener i.e order service
  // queue-group ensures events are sent to only one instance at a time
  readonly queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {    
    const { id, title, price, version } = data
    
    // const ticket = await Ticket.find({id: JSON.stringify(id)})
    const ticket = await Ticket.findOne({
      id,
      version: version - 1,
    })
    console.log(ticket, 'TICKETTTTS')
  
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