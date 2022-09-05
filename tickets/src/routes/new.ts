import express, { Request, Response } from 'express';
import { requireAuth } from '@e50tickets/common';

const router = express.Router();

router.post('/api/tickets', requireAuth, async (req: Request, res: Response) => {
    res.status(400).send({})
})

export { router as createTicketRouter }