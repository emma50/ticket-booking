import { useState } from "react";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: (ticket) => { console.log(ticket) }
  })

  const onSubmit = (event) => {
    event.preventDefault()
    doRequest()
  }

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2))
  }

  return (
    <div>
      <h1>Create a new ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="">Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="form-control"
            placeholder="e.g movie"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Price:</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            type="text"
            className="form-control"
            placeholder="e.g $20"
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket;