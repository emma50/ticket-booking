import { Publisher, Subjects, TicketCreatedEvent } from "@e50tickets/common";

// emit event to nats-streaming-server
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}