import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    // using express-validator
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  async (req: Request, res: Response) => {
    // validate request body
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    // check for user existence
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email in user');
      return res.send({});
    }

    // hash the password

    // create new user
    const user = await User.build({ email, password });

    // save to db
    await user.save();

    res.status(201).send(user);
  }
);

export { router as signupRouter };
