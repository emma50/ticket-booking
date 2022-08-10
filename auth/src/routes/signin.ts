import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { PasswordManager } from '../services/password';

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
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new BadRequestError('Sorry!!. Invalid credentials.')
    }

    // Compare passwords
    const passwordsMatch = await PasswordManager.compare(existingUser.password, password)

    if (!passwordsMatch) {
      throw new BadRequestError('Sorry!!. Invalid credentials')
    }

    // Generate JWT
    const userJWT = jwt.sign({
      id: existingUser.id,
      email: existingUser.email,
    }, process.env.MY_SECRETS!);

    // store it on session object
    req.session = { jwt: userJWT }

    res.status(200).send(existingUser)
})

export { router as signinRouter }