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