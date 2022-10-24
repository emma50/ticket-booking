import Router from "next/router"
import useRequest from "../../hooks/use-request"

const TicketShow = ({ ticket }) => {
  const {doRequest, errors} = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => Router.push('/orders/orderId', `/orders/${order.data.id}`)
  })
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={ doRequest } className="btn btn-primary">Purchase</button>
    </div>
  )
}

TicketShow.getInitialProps = async (context, client) => {
  // Extracting the ticketId query (because this file is called ticketId)
  const { ticketId } = context.query
  const res = await client.get(`/api/tickets/${ticketId}`)

  return {
    ticket: res.data.data
  }
}

export default TicketShow