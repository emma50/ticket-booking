import express, { Request, Response } from 'express'
import mongoose from 'mongoose';
import { param } from 'express-validator';
import {
  NotFoundError,
  NotAuthorizedError,
  validateRequest,
  requireAuth
} from '@e50tickets/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch('/api/orders/:orderId',
  [
    param('orderId')
      .not()
      .isEmpty()
      .custom((input: string) => {
        return mongoose.Types.ObjectId.isValid(input)
      })
      .withMessage('orderId must be provided')
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    // start mongoose session/transaction
    const session = await mongoose.startSession();

    try {
      order.set({ status: OrderStatus.Cancelled })
      await order.save()

      // Publish an event saying this was cancelled
      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        version: order.ticket.version,
        ticket: {
          id: order.ticket.id,
          price: order.ticket.price
        }
      })

      res.status(200).send({
        message: 'You cancelled an order',
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

export { router as cancelOrderRouter }