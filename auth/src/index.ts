import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log('Starting up...')
  if (!process.env.MY_SECRETS) {
    throw new Error('All secrets must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to auth mongodb')
  } catch (err) {
    console.error(err)
  } 
  app.listen(3000, () => {
    console.log('Server up at port 3000')
    console.log('Listening at port 3000')
  })
}

start()
