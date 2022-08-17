import "bootstrap/dist/css/bootstrap.css"

// nextjs custom component --> A wrapper around all components
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}