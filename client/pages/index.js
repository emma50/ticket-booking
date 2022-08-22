import buildClient from '../api/build-client'

// code executed on the browser
const Landing = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>Landing page</h1>
}

// code executed on the server during the SSR process
// or the browser during the CSR process
Landing.getInitialProps = async (context) => {
  const client = buildClient(context)
  const res = await client.get('/api/users/currentuser')
  return res.data
}

export default Landing