import express, { Request, Response } from 'express';
import { NotFoundError } from '@e50tickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const ticket = await Ticket.findById(id)

  if (!ticket) {
    throw new NotFoundError
  }

  res.status(200).send({
    message: 'Showing a ticket',
    data: ticket
  })
})

export { router as showTicketRouter }