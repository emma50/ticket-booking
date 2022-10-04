import { Subjects } from '@e50tickets/common'
import { Ticket } from '../ticket'
import { Event } from '../events'

it('Implements optimistic concurrent control', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    userId: '123'
  })

  // save to the database
  await ticket.save()
  
  // fetch the event twice
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

  const event = Event.build({
    name: Subjects.TicketCreated,
    data: {
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    }
  })

  await event.save()
  expect(event.data.version).toEqual(0)
  
  await ticket.save()
  event.data.version = ticket.version
  await event.save()
  expect(event.data.version).toEqual(1)

  await ticket.save()
  event.data.version = ticket.version
  await event.save()
  expect(event.data.version).toEqual(2)
})