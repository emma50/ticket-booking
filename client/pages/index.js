import axios from 'axios'

// code executed on the browser
const Landing = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>Landing page</h1>
}

// code executed on the server during the SSR process
// or the browser during the CSR process
Landing.getInitialProps = async ({ req }) => {
  console.log(req.headers)
  if (typeof window === 'undefined') {
    // code executed on the server
    console.log('on server')
    try {
      // request must be made with the server's domain name
      // i.e http://SERVICENAME.NAMESPACE.svc.cluster.local
      const res = await axios.get(
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
          headers: req.headers
        }
      )
      return res.data;
    } catch (err) {
      console.log(err)
    }
  } else {
    // code executed on the browser
    console.log('on browser')
    try {
      // request can be made with a base url of ''
      const res = await axios.get('/api/users/currentuser')
      return res.data;
    } catch (err) {
      console.log(err)
    }
  }
  return {}
}

export default Landing