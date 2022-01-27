import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

// standardize all API error responses and auto picks up when errors were thrown
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check error type and mapping to the format we wanted {message, field}
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // generic error
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
