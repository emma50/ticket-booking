import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { TicketUpdatedEvent } from "@e50tickets/common"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30,
  })
  await ticket.save()

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 40,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('Finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // Write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).toBeDefined()
  expect(updatedTicket!.id).toEqual(data.id)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('Acks the message', async () => {
  const { listener, data, msg } = await setup()

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled()
})

it('Does not call ack if the event has skipped a version number', async () => {
  const { listener, data, msg } = await setup()

  data.version = 3

  try {
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
  } catch(err) {

  }

  // Write assertions to make sure ack function is called
  expect(msg.ack).not.toHaveBeenCalled()
})