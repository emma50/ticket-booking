import request from "supertest";
import { app } from "../../app";

it('Should successfully signout a user by clearing the cookie', async () => {
  process.env.MY_SECRETS = 'asdfqwer'

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  const res = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200)

  console.log(res.get('Set-Cookie'))
})
