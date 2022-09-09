import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns 404 if a ticket is not found ', async () => {
  // Create a mongoose id
  const id = new mongoose.Types.ObjectId().toHexString()
  
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
})

it('returns a ticket if the ticket is found', async () => {
  const title = 'concert'
  const price = 20

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201)
  
  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.data.id}`)
    .send()
    .expect(200)

  expect(ticketRes.body.data.title).toEqual(title)
  expect(ticketRes.body.data.price).toEqual(price)
})

