import request from "supertest";
import { app } from "../../app";

it('should respond with details about current user', async () => {
  process.env.MY_SECRETS = 'asdfqwer'

  // const authRes = await request(app)
  //   .post('/api/users/signup')
  //   .send({
  //     email: 'test@test.com',
  //     password: 'password'
  //   })
  //   .expect(201)
  
  // const cookie = authRes.get('Set-Cookie')
  const cookie = await signup()
  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(res.body.currentUser.email).toEqual('test@test.com')
})

