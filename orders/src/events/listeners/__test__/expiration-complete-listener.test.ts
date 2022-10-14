import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { ExpirationCompleteEvent, OrderStatus } from "@e50tickets/common"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { Order } from "../../../models/order"

const setup = async () => {
  // Create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30,
  })
  await ticket.save()

  // Create and save order
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  })
  await order.save()

  // Create a fake data object
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket, order }
}

it('Updates the order status to cancelled', async () => {
  const { listener, data, msg, order } = await setup()

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // Write assertions to make sure an order was created
  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder).toBeDefined()
  expect(updatedOrder!.id).toEqual(data.orderId)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('Should emit an OrderCancelled event', async () => {
  const { listener, data, msg, order } = await setup()

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(eventData.id).toEqual(order.id)
})

it('Acks the message', async () => {
  const { listener, data, msg } = await setup()

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled()
})

it('Does not call ack if there is a wrong orderId', async () => {
  const { listener, data, msg } = await setup()

  data.orderId = 'wrteyytgyhdhn'

  try {
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
  } catch(err) {

  }

  // Write assertions to make sure ack function is called
  expect(msg.ack).not.toHaveBeenCalled()
})