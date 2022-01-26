import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    // using express-validator
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be bewtween 4 and 20 characters'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    // if there are errors
    if (!errors.isEmpty()) {
      throw new Error('Invalid email or password');
    }

    const { email, password } = req.body;

    console.log('Creating a user...');
    throw new Error('Error connecting to database');

    // new User({email, password});
    res.send({});
  }
);

export { router as signupRouter };
