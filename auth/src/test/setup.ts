import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";
import request from 'supertest'
import { app } from "../app";

declare global {
  var signup: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async() => {
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
}, 300000)


global.signup = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const res = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)

    const cookie = res.get('Set-Cookie')

    return cookie
}