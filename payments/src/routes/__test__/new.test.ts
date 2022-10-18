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

it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  const price = Math.floor(Math.random() * 100000)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price,
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

  const stripeCharges = await stripe.charges.list({
    // A limit on the number of objects to be returned
    limit: 30,
  });

  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === (price * 100)
  })

  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.currency).toEqual('usd')
})