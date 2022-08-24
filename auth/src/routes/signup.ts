import express from 'express';
import { body } from 'express-validator'
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@e50tickets/common';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup', 
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
  .trim()
  .isLength({ min: 4, max: 20 })
  .withMessage('Password must be between 4 and 20 characters'),
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('User already exist')
    }
    console.log('User does not exist')
    const newUser = User.build({ email, password })
    await newUser.save()

    // Generate JWT
    const userJWT = jwt.sign({
      id: newUser.id,
      email: newUser.email,
    }, process.env.MY_SECRETS!);

    // store it on session object
    req.session = { jwt: userJWT }

    res.status(201).send(newUser)
})

export { router as signupRouter }