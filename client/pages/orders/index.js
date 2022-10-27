const MyOrders = ({ orders }) => {
    const orderList = orders 
      ? orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        )
      }) : 'You have no order'
  return (
    <div>
      <h3>My list of orders</h3>
      <ul>{orderList}</ul>
    </div>
  )
}

MyOrders.getInitialProps = async (context, client) => {
  const res = await client.get('/api/orders/')

  return {
    orders: res.data.data
  }
}

export default MyOrders