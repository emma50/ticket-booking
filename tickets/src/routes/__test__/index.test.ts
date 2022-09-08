import request from 'supertest'
import { app } from '../../app'

const createTicket = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201)
}

it('returns 200 if list of all tickets is empty', async () => {
  const res = await request(app)
    .get(`/api/tickets`)
    .send()
    .expect(200)
})

it('fetch a list of all tickets', async () => {
  await createTicket('concert', 20)
  await createTicket('movie', 10)
  await createTicket('football', 30)

  const res = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

  expect(res.body.data[0].title).toEqual('concert')
  expect(res.body.data[0].price).toEqual(20)
  expect(res.body.data.length).toEqual(3)
})

