import { Publisher, Subjects, OrderCreatedEvent } from "@e50tickets/common";

// emit event to nats-streaming-server
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}