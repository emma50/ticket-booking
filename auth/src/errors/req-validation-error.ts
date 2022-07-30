import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error"

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters')
  
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map((error) => { 
      return {
        message: error.msg, 
        field: error.param
      } 
    });
  }
}





// interface CustomErrors {
//   statusCode: number;
//   serializeErrors(): {
//     message: string;
//     field?: string;
//   }[]
// }

// export class RequestValidationError extends Error implements CustomErrors {
//   statusCode = 400
//   constructor(public errors: ValidationError[]) {
//     super()
  
//     // Set the prototype explicitly.
//     Object.setPrototypeOf(this, RequestValidationError.prototype)
//   }

//   serializeErrors() {
//     return this.errors.map((error) => { 
//       return {
//         message: error.msg, 
//         field: error.param
//       } 
//     });
//   }
// }