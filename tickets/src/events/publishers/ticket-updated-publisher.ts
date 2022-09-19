import { Publisher, Subjects, TicketUpdatedEvent } from "@e50tickets/common";

// emit event to nats-streaming-server
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}