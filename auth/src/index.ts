import express from "express";
import 'express-async-errors'
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/singup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from "./errors/not-found-error";
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('trust proxy', true)
app.use(cookieSession({
  signed: false,
  secure: true,
}))
app.use(signupRouter)
app.use(signinRouter)
app.use(currentUserRouter)
app.use(signoutRouter)
app.all('*', async () => {
  throw new NotFoundError()
})
// app.all('*', async (req, res, next) => {
//   next(new NotFoundError())
// })
app.use(errorHandler)

const start = async () => {
  if (!process.env.MY_SECRETS) {
    throw new Error('All secrets must be defined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('Connected to mongodb')
  } catch (err) {
    console.error(err)
  } 
  app.listen(3000, () => {
    console.log('Server up at port 3000')
    console.log('Listening at port 3000')
  })
}

start()
