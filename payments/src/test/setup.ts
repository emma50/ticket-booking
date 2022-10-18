import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

jest.setTimeout(400000)
jest.mock('../nats-wrapper.ts')
// jest.mock('../stripe.ts')
declare global {
  var signin: (id?: string) => string[];
}

process.env.STRIPE_KEY

let mongo: any;
beforeAll(async() => {
  process.env.MY_SECRETS
  // Create a mongo memory server connection before running all tests
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async() => {
  // clear all mocks
  jest.clearAllMocks()
  // Delete all collections for each test operation
  const collections = await mongoose.connection.db.collections();
  
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async() => {
  // Stop and close connection to mongodb
  await mongo.stop()
  await mongoose.connection.close()
})


global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  const token = jwt.sign(payload, process.env.MY_SECRETS!)
  const session = {
    jwt: token
  }
  const sessionJSON = JSON.stringify(session)
  // encode sessionJSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // Return the cookie with it's encoded data
  return [`session= ${base64}`]
}