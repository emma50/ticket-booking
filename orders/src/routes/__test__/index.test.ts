import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

const createTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    title,
    price
  })
  await ticket.save()
  return ticket
}

it('fetches orders of a specific user ', async () => {
  // create 3 tickets
  const ticketOne = await createTicket('concert', 20)
  const ticketTwo = await createTicket('movie', 40)
  const ticketThree = await createTicket('birthday', 10)

  // user #1
  const userOne = global.signin()

  // user #2
  const userTwo = global.signin()

  // user #1 creates an order
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  // user #2 creates two orders
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  // user #2 fetches it's own orders
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  // make sure we only get the orders for user #2
  expect(res.body.data.length).toEqual(2)
  expect(res.body.data[0].id).toEqual(orderOne.data.id)
  expect(res.body.data[1].id).toEqual(orderTwo.data.id)
  expect(res.body.data[0].ticket.id).toEqual(ticketTwo.id)
  expect(res.body.data[1].ticket.id).toEqual(ticketThree.id)
})
