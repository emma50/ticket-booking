import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

const createTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title,
    price
  })
  await ticket.save()
  return ticket
}

it('cancel an order of a specific user ', async () => {
  // create a ticket
  const ticket = await createTicket('concert', 20)

  // create a user
  const user = global.signin()

  // user creates an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // user cancels the order
  const res = await request(app)
    .patch(`/api/orders/${order.data.id}`)
    .set('Cookie', user)
    .expect(200)

  expect(res.body.data.id).toEqual(order.data.id)
})

it('returns a 404 error if order is not found', async () => {
  // create a mongoose id
  const orderId = new mongoose.Types.ObjectId().toHexString()

  // create a ticket
  const ticket = await createTicket('concert', 20)

  // create a user
  const user = global.signin()

  // user creates an order
  await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // user tries to cancel an order that does not exist
  await request(app)
    .patch(`/api/orders/${orderId}`)
    .set('Cookie', user)
    .expect(404)
})

it('returns a 401 error if a user tries to update (cancel) another user order', async () => {
  // create a ticket
  const ticket = await createTicket('concert', 20)

  // user #1
  const userOne = global.signin()

  // user #2
  const userTwo = global.signin()

  // user #1 creates an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201)

  // user #2 tries to cancel user #1 order
  await request(app)
    .patch(`/api/orders/${order.data.id}`)
    .set('Cookie', userTwo)
    .expect(401)
})

it('should mark an order as cancelled', async () => {
  // create a ticket
  const ticket = await createTicket('concert', 20)

  // user 
  const user = global.signin()

  // user creates an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // user cancel an order
  const res = await request(app)
    .patch(`/api/orders/${order.data.id}`)
    .set('Cookie', user)
    .expect(200)

  // user fetch the cancelled order
  const getRes = await request(app)
    .get(`/api/orders/${order.data.id}`)
    .set('Cookie', user)
    .expect(200)

  expect(res.body.data.status).toEqual(getRes.body.data.status)
})

it('emits an order:cancelled event', async () => {
  // create a ticket
  const ticket = await createTicket('concert', 20)

  // user 
  const user = global.signin()

  // user creates an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // user cancel an order
  const res = await request(app)
    .patch(`/api/orders/${order.data.id}`)
    .set('Cookie', user)
    .expect(200)

  // user fetch the cancelled order
  const getRes = await request(app)
    .get(`/api/orders/${order.data.id}`)
    .set('Cookie', user)
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})