const NewTicket = () => {
  return (
    <div>
      <h1>Create a new ticket</h1>
      <form>
        <div className="form-group">
          <label htmlFor="">Title:</label>
          <input type="text" className="form-control"/>
        </div>
        <div className="form-group">
          <label htmlFor="">Price:</label>
          <input type="text" className="form-control"/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket;