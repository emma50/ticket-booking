import request from 'supertest'
import { app } from '../../app'

it('has a route handler listening to /api/tickets for a POST request', async () => {
  //
})

it('/api/tickets can only be accessed if the user is signed in', async () => {
  //
})

it('returns an error if invalid title is provided', async () => {
  //
})

it('returns an error if invalid price is provided', async () => {
  //
})

it('creates a ticket with valid inputs', async () => {
  //
})