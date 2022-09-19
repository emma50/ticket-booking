import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.MY_SECRETS) {
    throw new Error('All secrets must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    await natsWrapper.connect('ticketing', '123abc', 'http://nats-srv:4222')
    natsWrapper.close()
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to ticket mongodb')
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('Server up at port 3000')
    console.log('Listening at port 3000')
  })
}

start()
