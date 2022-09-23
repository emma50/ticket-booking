import express, { Request, Response } from 'express'
import mongoose from 'mongoose';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  NotAuthorizedError
} from '@e50tickets/common';
import { param } from 'express-validator';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
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

    res.status(200).send({
      message: 'Showing a single order',
      data: order
    })
})

export { router as showOrderRouter }