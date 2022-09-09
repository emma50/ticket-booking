import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  NotFoundError
} from '@e50tickets/common';
import { body } from 'express-validator'
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id',
  requireAuth,
  [
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

    // Update the found ticket document in memory
    ticket.set({ title, price })
    // Save ticket document in DB
    await ticket.save()

    res.status(200).send({
      message: 'Successfully updated a ticket',
      data: ticket
    })
})

export { router as updateTicketRouter }