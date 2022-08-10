import express, { Request, Response } from 'express';
import { body } from 'express-validator';
// import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
// import { User } from '../models/user';
// import { PasswordManager } from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
  [body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('A password must be supplied')],
    validateRequest,
    async (req: Request, res: Response) => {
    //   const { email, password } = req.body
    //   const existingUser = await User.findOne({ email })

    //   if (!existingUser) {
    //     throw new BadRequestError('Sorry!!. Invalid credentials.')
    //   }

    // // Compare passwords
    // const comparePassword = PasswordManager.compare(existingUser.password, password)
})

export { router as signinRouter }