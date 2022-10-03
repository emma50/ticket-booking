import mongoose from 'mongoose'
import { Ticket } from '../ticket'

it('Implements optimistic concurrent control', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    userId: '123'
  })

  // save to the database
  await ticket.save()
  
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  // make two separate changes to the fetched instance
  firstInstance!.set({price: 25})
  secondInstance!.set({price: 15})

  // save the first fetched ticket
  await firstInstance!.save()

  // save the second fetched instance and expect an error
  try {
    await secondInstance!.save()
  } catch(err) {
    return;
  }

  throw new Error('Should not reach this point')
})

it('Increment the version number on multiple saves ', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    userId: '123'
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
  
  await ticket.save()
  expect(ticket.version).toEqual(1)

  await ticket.save()
  expect(ticket.version).toEqual(2)
})