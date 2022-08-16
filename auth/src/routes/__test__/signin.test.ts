import request from "supertest";
import { app } from "../../app";

it('Should successfully signin a user', async () => {
  process.env.MY_SECRETS = 'asdfqwer'

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200)
})

it('Should fail if not signed up', async () => {
  process.env.MY_SECRETS = 'asdfqwer'

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400)
})

it('Should fail if password is incorrect', async () => {
  process.env.MY_SECRETS = 'asdfqwer'

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pas'
    })
    .expect(400)
})

it('Should fail if email is incorrect', async () => {
  process.env.MY_SECRETS = 'asdfqwer'

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'testcom',
      password: 'password'
    })
    .expect(400)
})

