import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  Subjects
} from '@e50tickets/common';
import { body } from 'express-validator'
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Event, EventStatus } from '../models/events';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
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
    const { id } = req.params
    const { title, price } = req.body

    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError
    }

    // start mongoose session
    const session = await mongoose.startSession();

    try {
      // Start transaction
      await session.startTransaction();

      // Update the found ticket document in memory
      ticket.set({ title, price })
      // Save ticket document in DB
      await ticket.save()

      const ticketEvent = Event.build({
        name: Subjects.TicketUpdated,
        data: {
          title: ticket.title,
          price: ticket.price,
          userId: req.currentUser!.id,
          version: ticket.version
        }
      });
      await ticketEvent.save();
      
      new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      })

      ticketEvent.set({ status: EventStatus.COMPLETED })
      await ticketEvent.save();

      res.status(200).send({
        message: 'Successfully updated a ticket',
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

export { router as updateTicketRouter }