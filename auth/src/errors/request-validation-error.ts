import { ValidationError } from 'express-validator';

// build own custom error
export class RequestValidationError extends Error {
  statusCode = 400;

  // using private/public = setting this.errors = errors
  constructor(public errors: ValidationError[]) {
    super();

    // Only because we're extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(err => {
      return { message: err.msg, field: err.param };
    });
  }

}

// to use
// throw new RequestValidationError(errors);
