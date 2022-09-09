import express from "express";
import 'express-async-errors'
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from '@e50tickets/common'

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('trust proxy', true)
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}))
app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)
app.all('*', async () => {
  throw new NotFoundError()
})
// app.all('*', async (req, res, next) => {
//   next(new NotFoundError())
// })
app.use(errorHandler)

export { app }
