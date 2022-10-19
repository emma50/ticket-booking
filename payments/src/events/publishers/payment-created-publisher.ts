import { Publisher, Subjects, PaymentCreatedEvent } from '@e50tickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}