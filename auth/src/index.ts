import mongoose from "mongoose";
import { app } from "./app";

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
