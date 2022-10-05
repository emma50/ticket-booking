import express, { Request, Response } from 'express'
import mongoose from 'mongoose';
import {
  requireAuth,
  validateRequest,
  OrderStatus,
  NotFoundError,
  BadRequestError
} from '@e50tickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post(
  '/api/orders/',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => {
        return mongoose.Types.ObjectId.isValid(input)
      })
      .withMessage('ticketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // Find the ticket a user is trying to order in the database
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // Calculate the expiration date for this order
    // expiration = current date + 15mins in the future
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
    // expiration.setSeconds(expiration.getSeconds() + Number(process.env.EXPIRATION_WINDOW_SECONDS))

    // start mongoose session/transaction
    const session = await mongoose.startSession();

    try {
      // Build the order and save it to the database
      const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
      })
      await order.save()

      // Publish an event saying that an order has been created
      await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        version: order.ticket.version,
        ticket: {
          id: order.ticket.id,
          price: order.ticket.price
        }
      })

      res.status(201).send({
        message: 'You created an order',
        data: order
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

export { router as createOrderRouter }