import request from 'supertest'
import { app } from '../../app'

it('has a route handler listening to /api/tickets for a POST request', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .send({})

  expect(res.status).not.toEqual(404)
})

it('/api/tickets can only be accessed if the user is signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)

  expect(res.status).toEqual(401)
})

it('returns a status-code other than 401 if user is signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

  expect(res.status).not.toEqual(401)
})

it('returns an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    }).expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    }).expect(400)
})

it('returns an error if invalid price is provided', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'Movie ticket',
    price: -10
  }).expect(400)

await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    Title: 'Movie ticket',
  }).expect(400)
})

it('creates a ticket with valid inputs', async () => {
  //
})