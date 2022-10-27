import { useState } from "react";
import axios from 'axios'

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const res = await axios[method](url, { ...body, ...props })
      
      if (onSuccess) {
        onSuccess(res.data)
      }
      return res.data
    } catch(err) {
      setErrors(
        <div className='alert alert-danger'>
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err.response.data.error.map((err) => <li key={err.message}>{err.message}</li>)}
          </ul>
        </div>
      )
    }
  }

  return { errors, doRequest } 
}