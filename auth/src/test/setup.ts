import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";
import { app } from "../app";

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
})

