import { CustomError } from "./custom-error"

export class NotFoundError extends CustomError {
  statusCode = 404
  reason: string = 'Route does not exist'
  constructor() {
    super('Route not found')

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [{
      message: this.reason
    }]
  }
}