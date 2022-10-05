import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@e50tickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  // in the case of multiple running instances of a listener i.e order service
  // queue-group ensures events are sent to only one instance at a time
  readonly queueGroupName = queueGroupName

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    try {
      const ticket = Ticket.build(data)
      
      await ticket.save()
      msg.ack()
    } catch(err) {
      console.error(`Error: ${err}`)
    }
  }
}