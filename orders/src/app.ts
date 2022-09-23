import express from "express";
import 'express-async-errors'
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from '@e50tickets/common'

import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { cancelOrderRouter } from "./routes/cancel";

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('trust proxy', true)
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}))
app.use(currentUser)
app.use(createOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(cancelOrderRouter)
app.all('*', async () => {
  throw new NotFoundError()
})
// app.all('*', async (req, res, next) => {
//   next(new NotFoundError())
// })
app.use(errorHandler)

export { app }
