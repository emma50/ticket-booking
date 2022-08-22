import buildClient from '../api/build-client'

// code executed on the browser
const Landing = ({ currentUser }) => {
  console.log(currentUser)
  return currentUser ? <h1>You are already signed in</h1>
  : <h1>You are not signed in</h1>
}

// code executed on the server during the SSR process
// or the browser during the CSR process
Landing.getInitialProps = async (context) => {
  const client = buildClient(context)
  const res = await client.get('/api/users/currentuser')
  return res.data
}

export default Landing