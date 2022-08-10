import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/req-validation-error';
import { validateRequest } from '../middlewares/validate-request';

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
      // const { email, password } = req.body
})

export { router as signinRouter }