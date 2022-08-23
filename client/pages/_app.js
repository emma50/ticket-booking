import "bootstrap/dist/css/bootstrap.css"
import buildClient from "../api/build-client"
import Header from "../components/Header"

// nextjs custom component --> A wrapper around all components
 const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <Component {...pageProps} />
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const res = await client.get('/api/users/currentuser')
  
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }
  return {
    pageProps,
    currentUser: res.data.currentUser
  }
}

export default AppComponent