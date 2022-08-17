import request from "supertest";
import { app } from "../../app";

it('should respond with details about current user', async () => {
  process.env.MY_SECRETS = 'asdfqwer'

  const cookie = await signup()
  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(res.body.currentUser.email).toEqual('test@test.com')
})

it('should respond with null if not authenticated', async () => {
  process.env.MY_SECRETS = 'asdfqwer'

  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)

  console.log(res.body.currentUser, 'RESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT')
  expect(res.body.currentUser).toEqual(null)
})
