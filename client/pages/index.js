// code executed on the browser
const Landing = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((tickets) => {
    return (
      <tr key={tickets.id}>
        <td>{tickets.title}</td>
        <td>{tickets.price}</td>
      </tr>
    )
  })

  return (
    <div>
      {currentUser ? <h4>You are already signed in</h4> : <h4>You are not signed in</h4>}
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
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