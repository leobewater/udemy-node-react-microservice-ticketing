export class DatabaseConnectionError extends Error {
  statusCode = 500;
  reason = 'Error connecting to database';

  constructor() {
    super();

    // Only because we're extending a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  // mapping to the format we wanted {message, field}
  serializeErrors() {
    return [{ message: this.reason }];
  }
}

// to use
// throw new DatabaseConnectionError(errors);
