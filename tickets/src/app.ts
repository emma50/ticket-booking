import express from "express";
import 'express-async-errors'
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from '@e50tickets/common'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('trust proxy', true)
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}))
app.all('*', async () => {
  throw new NotFoundError()
})
// app.all('*', async (req, res, next) => {
//   next(new NotFoundError())
// })
app.use(errorHandler)

export { app }