import express from 'express';
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/req-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
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
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }
    
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('User already exist')
    }
    console.log('User does not exist')
    const newUser = User.build({ email, password })
    await newUser.save()

     res.status(201).send(newUser)
    // res.status(201).send('FRESHMAN SEASON')

})

export { router as signupRouter }