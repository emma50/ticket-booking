import { useState, useEffect } from 'react'
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const findTimeLeft = () => {

      const msLeft = new Date(order.expiresAt) - new Date()
      // msLeft / 1000 converts millisecs to secs
      setTimeLeft(Math.round(msLeft / 1000))
    }

    // Manually invoke findTimeLeft immediately
    findTimeLeft()

    const timerId = setInterval(findTimeLeft , 1000)

    // Invoked when navigating away from the component
    return () => {
      clearInterval(timerId)
    }
  }, [order])

  const expirationTimer = timeLeft <= 0
    ? `Sorry your order has expired`
    : `Time left to pay: ${timeLeft} seconds`

  return (
    <div>
      {expirationTimer}
      <StripeCheckout
        token={(token) => console.log(token)}
        // stripe publishable key
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.trim()}
        // convert to dollar (stripe treats everything as cents)
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  // Extracting the orderId query (because this file is called orderId)
  const { orderId } = context.query
  const res = await client.get(`/api/orders/${orderId}`)

  return {
    order: res.data.data
  }
}

export default OrderShow