import Link from 'next/link'

// code executed on the browser
const Landing = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={'/tickets/[ticketId]'} as={`/tickets/${ticket.id}`}>
            <a >View</a>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div>
      {currentUser ? <p>You are already signed in</p> : <p>You are not signed in</p>}
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  )
}

// code executed on the server during the SSR process
// or the browser during the CSR process
Landing.getInitialProps = async (context, client, currentUser) => {
  const res = await client.get('/api/tickets')
   return { tickets: res.data.data }
}

export default Landing