import { Listener, OrderCreatedEvent, Subjects } from "@e50tickets/common";
import { Message } from 'node-nats-streaming'
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    console.log(`Waiting this miliseconds to process the job: ${delay}`)
    
    try {
      await expirationQueue.add({
        orderId: data.id
      }, { delay })
  
      msg.ack()
    } catch(err) {
      console.error(`Error: ${err}`)
    }
  }
}