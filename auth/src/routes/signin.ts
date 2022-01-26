import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must provide a password'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    // const { email, password } = req.body;

    // // check for user existence
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   throw new BadRequestError('Email in use');
    // }

    res.send('sign in');
  }
);

export { router as signinRouter };
