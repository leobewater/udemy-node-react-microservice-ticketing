import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@mmb8npm/common';

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    // using express-validator for request validation
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check for user existence
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // create new user
    const user = await User.build({ email, password });

    // run user pre-save hook and save to db
    await user.save();

    // generate JWT with private key
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // ! = ignore TS check
    );

    // store it on the cookie session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
