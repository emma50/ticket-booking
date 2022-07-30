import { CustomError } from "./custom-error"

export class BadRequestError extends CustomError {
  statusCode = 400
  constructor(public error: string) {
    super(error)
  
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors() {
    return [{
      message: this.error
    }] 
  }
}
