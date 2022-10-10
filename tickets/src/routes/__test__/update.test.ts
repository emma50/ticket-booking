import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'

const id = new mongoose.Types.ObjectId().toHexString()

it('return 404 if the provided ticket id does not exist', async () => {
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'movie',
      price: 20
    })

  expect(res.status).toEqual(404)
})

it('return 401 if the user is not authenticated', async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'movie',
      price: 20
    }).expect(401)
})

it('return 401 if the provided user does not own the ticket', async () => {
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'movie',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'movie',
      price: 200
    }).expect(401)
})

it('returns 400 if the user provides invalid title or price', async () => {
  // reference to cookie as same user 
  const cookie = global.signin()

  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'movie',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 200
    }).expect(400)

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'movie',
      price: -1
    }).expect(400)

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: -1
    }).expect(400)
})

it('updates the ticket with provided valid inputs', async () => {
  // reference to cookie as same user 
  const cookie = global.signin()

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'movie',
      price: 10
    })

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new ticket',
      price: 20
    }).expect(200)

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.data.id}`)
    .send()
    .expect(200)

  expect(ticketRes.body.data.title).toEqual('new ticket')
  expect(ticketRes.body.data.price).toEqual(20)
})

it('publishes an event', async () => {
  const cookie = global.signin()

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'movie',
      price: 10
    })

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new ticket',
      price: 20
    }).expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('Rejects update if ticket is reserved', async () => {
  const cookie = global.signin()

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'movie',
      price: 10
    })

  const ticket = await Ticket.findById(res.body.data.id)
  const orderId = new mongoose.Types.ObjectId().toHexString()
  ticket!.set({ orderId })
  await ticket!.save()

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new ticket',
      price: 20
    }).expect(400)
})