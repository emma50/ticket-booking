import request from "supertest";
import { app } from "../../app";

it('Should successfully signup a user', async () => {
  process.env.MY_SECRETS = 'asdfqwer'

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
})

it('Should return a status of 400 with an invalid email', async () => {
  process.env.MY_SECRETS = 'asdfqwer'
  
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testasdftes',
      password: 'password'
    })
    .expect(400)
})

it('Should return a status of 400 with invalid password', async () => {
  process.env.MY_SECRETS = 'asdfqwer'
  
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pas'
    })
    .expect(400)
})

it('Should return a status of 400 with missing credentials', async () => {
  process.env.MY_SECRETS = 'asdfqwer'
  
  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
})

it('Should return a status of 400 with invalid credentials', async () => {
  process.env.MY_SECRETS = 'asdfqwer'
  
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'tetestcom',
      password: 'pas'
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
})

it('Should disallow duplicate credentials', async () => {
  process.env.MY_SECRETS = 'asdfqwer'
  
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400)
})

it('Should set cookie after successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  expect(res.get('Set-Cookie')).toBeDefined()
})
