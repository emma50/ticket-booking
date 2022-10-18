import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@e50tickets/common";
import { app } from '../../app';
import { Order } from "../../models/order";
import { stripe } from "../../stripe";

it('Returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '1234qwer',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})

it('Returns a 401 when purchasing an order that does not belong to the user', async () => {
  // Create an order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 20
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '1234qwer',
      orderId: order.id
    })
    .expect(401)
})

it('Returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()

  // Cancel an order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    price: 20,
    userId,
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: '1234qwer',
      orderId: order.id
    })
    .expect(400)
})

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 20,
    userId,
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_mastercard',
      orderId: order.id
    })
    .expect(201)

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

    expect(chargeOptions.source).toEqual('tok_mastercard')
    expect(chargeOptions.amount).toEqual(order.price * 100)
    expect(chargeOptions.currency).toEqual('usd')
    expect(chargeOptions.description).toEqual('You created a ticket order')

})