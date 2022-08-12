import { CustomError } from "./custom-error"

export class NotAuthorizedError extends CustomError {
  statusCode = 401
  reason: string = 'Route is not authorized'
  constructor() {
    super('Route not Authorized')

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors() {
    return [{
      message: this.reason
    }]
  }
}