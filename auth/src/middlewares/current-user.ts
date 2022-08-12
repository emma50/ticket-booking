import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string,
  email: string,
  iat?: number
}

// Modify existing type defination
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next()
  }

  try {
    const payload = (jwt.verify(req.session.jwt, process.env.MY_SECRETS!)) as UserPayload
    req.currentUser = payload
    console.log(req.currentUser, 'UUUUUUUUUUUUUUUUUU')
  } catch(err) {
    next()
  }

  next()
}