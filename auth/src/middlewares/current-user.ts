import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// add new property to existing Data Type modification
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// authenticate user middleware and assign logged in user info to currentUser cookie
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check if cookie has jwt
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;

  } catch (err) {}

  next();
};
