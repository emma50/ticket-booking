import { Publisher, Subjects, OrderCancelledEvent } from "@e50tickets/common";

// emit event to nats-streaming-server
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}