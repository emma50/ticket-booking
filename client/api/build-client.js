import axios from 'axios'

export default ({ req }) => {
  if (typeof window === 'undefined') {
    console.log('on server')
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    console.log('on browser')
    return axios.create({
      baseURL: '/',
      headers: req.headers
    });
  }
  return {}
}
