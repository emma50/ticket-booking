import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { OrderCancelledEvent, OrderStatus } from "@e50tickets/common"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  // Create and save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  })
  ticket.set({ orderId })
  await ticket.save()

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: ticket.userId,
    version: 0,
    status: OrderStatus.Cancelled,
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket, orderId }
}

it('Updates the ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // Write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).not.toBeDefined()
})

it('Acks the message', async () => {
  const { listener, data, msg } = await setup()

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled()
})

it('Publishes a ticket-cancelled event', async () => {
  const { listener, data, msg, ticket } = await setup()

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // Write assertions to make sure publish function is called
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  console.log((natsWrapper.client.publish as jest.Mock).mock.calls)
})
