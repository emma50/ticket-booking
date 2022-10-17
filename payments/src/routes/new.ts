import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  Subjects,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@e50tickets/common';
import { body } from 'express-validator'
import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token')
      .not()
      .isEmpty()
      .withMessage('Token is required'),
    body('orderId')
    .not()
    .isEmpty()
    .custom((input: string) => {
      return mongoose.Types.ObjectId.isValid(input)
    })
    .withMessage('orderId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {token, orderId} = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order')
    }

    res.send({
      success: true
    })

    // // start mongoose session
    // const session = await mongoose.startSession();

    // try {
    //   // Start transaction
    //   await session.startTransaction();
    // } catch (err) {
    //   // remove everything from db on error
    //   await session.abortTransaction();
    //   throw err;
    // } finally {
    //   // close session on both success and error
    //   await session.endSession();
    // }
})

export { router as createChargeRouter }