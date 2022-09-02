import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/tickets', async (req: Request, res: Response) => {
    res.status(400).send({})
})

export { router as createTicketRouter }