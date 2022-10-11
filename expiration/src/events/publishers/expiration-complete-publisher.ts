import { Publisher, Subjects, ExpirationCompleteEvent} from "@e50tickets/common";

// emit event to nats-streaming-server
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}