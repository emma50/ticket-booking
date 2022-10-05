import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, Subjects } from '@e50tickets/common';
import { body } from 'express-validator'
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Event, EventStatus } from '../models/events';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {title, price} = req.body

    // start mongoose session
    const session = await mongoose.startSession();

    try {
      // Start transaction
      await session.startTransaction();

      const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
      })
      await ticket.save()
    
      const ticketEvent = Event.build({
        name: Subjects.TicketCreated,
        data: {
          title: ticket.title,
          price: ticket.price,
          userId: req.currentUser!.id,
          version: ticket.version
        }
      });
      await ticketEvent.save();

      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticketEvent.id,
        title: ticketEvent.data.title,
        price: ticketEvent.data.price,
        userId: ticketEvent.data.userId,
        version: ticketEvent.data.version,
      })

      ticketEvent.set({ status: EventStatus.COMPLETED })
      await ticketEvent.save();

      res.status(201).send({
        message: 'Successfully created a ticket',
        data: ticket
      })
    } catch (err) {
      // remove everything from db on error
      await session.abortTransaction();
      throw err;
    } finally {
      // close session on both success and error
      await session.endSession();
    }
})

export { router as createTicketRouter }