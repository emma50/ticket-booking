import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@e50tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 20
  })

  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    userId: order.userId,
    status: order.status,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, order }
}

it('Updates Order status', async() => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async() => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})