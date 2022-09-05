import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
// import { app } from "../app";
// import request from 'supertest'

jest.setTimeout(400000)
declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async() => {
   process.env.MY_SECRETS = 'asdfasdf'
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
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
  // Build a JWT payload. { id, email }
  const payload = {
    id: '123abc',
    email: 'test@test.com'
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.MY_SECRETS!)

  // Build session object. { jwt: MY_JWT }
  const session = {
    jwt: token
  }
  // Turn the session into JSON
  const sessionJSON = JSON.stringify(session)
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // Return the cookie with it's encoded data
  return [`session= ${base64}`]
}