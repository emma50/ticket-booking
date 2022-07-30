// const express = require('express');
import express from "express";
import 'express-async-errors'
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/singup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from "./errors/not-found-error";
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(currentUserRouter)
app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.all('*', async () => {
  throw new NotFoundError()
})
// app.all('*', async (req, res, next) => {
//   next(new NotFoundError())
// })
app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('Connected to mongodb')
  } catch (err) {
    console.error(err)
  } 
  // finally {
  //   app.listen(3000, () => {
  //     console.log('Server up at port 3000')
  //     console.log('Listening at port 3000')
  //   })
  // }
  app.listen(3000, () => {
    console.log('Server up at port 3000')
    console.log('Listening at port 3000')
  })
}

start()
