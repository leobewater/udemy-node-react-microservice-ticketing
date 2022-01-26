import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

// build own custom error
export class RequestValidationError extends CustomError  {
  statusCode = 400;

  // using private/public = setting this.errors = errors
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we're extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  // mapping to the format we wanted {message, field}
  serializeErrors() {
    return this.errors.map(err => {
      return { message: err.msg, field: err.param };
    });
  }

}

// to use
// throw new RequestValidationError(errors);
