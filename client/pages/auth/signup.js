import { useState } from 'react'
import { useRouter } from 'next/router'
import useRequest from '../../hooks/use-request'

export default () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { errors, doRequest } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => router.push('/')
  })

  const onSubmit = async (evt) => {
    evt.preventDefault()

    doRequest()
    setEmail('')
    setPassword('')
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label htmlFor="email">Email Address</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className='form-control'/>
      </div>
      <div className='form-group'>
        <label htmlFor="password">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  className='form-control'/>
      </div>
      {errors}
      <button className='btn btn-primary'>Sign Up</button>
    </form>
  )
}