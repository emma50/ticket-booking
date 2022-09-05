import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

jest.setTimeout(400000)
declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async() => {
   process.env.MY_SECRETS = 'asdfasdf'
  // Create a mongo memory server connection before running all tests
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async() => {
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


global.signin = () => {
  const payload = {
    id: '123abc',
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