import express, { Request, Response } from 'express'
import { requireAuth } from '@e50tickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket')

  res.status(200).send({
    message: 'Showing all your orders',
    data: order
  })
})

export { router as indexOrderRouter }