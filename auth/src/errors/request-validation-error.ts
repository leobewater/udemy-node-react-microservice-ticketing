import { ValidationError } from 'express-validator';

// build own custom error
export class RequestValidationError extends Error {
  // using private/public = setting this.errors = errors
  constructor(public errors: ValidationError[]) {
    super();

    // Only because we're extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}

// to use
// throw new RequestValidationError(errors);
