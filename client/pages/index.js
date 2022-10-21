// code executed on the browser
const Landing = ({ currentUser }) => {
  console.log(currentUser)
  return currentUser ? <h1>You are already signed in</h1>
  : <h1>You are not signed in</h1>
}

// code executed on the server during the SSR process
// or the browser during the CSR process
Landing.getInitialProps = async (context, client, currentUser) => {
  return {}
}

export default Landing