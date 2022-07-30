import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

export class Password { 
  static async toHash(password: string) {
    try {
      const salt = randomBytes(16).toString('hex')
      const buf = (await scryptAsync(password, salt, 64)) as Buffer

      return `${buf.toString('hex')}.${salt}`
    } catch(err) {
      console.log(err)
    }
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    try {
      const [hashedPassword, salt] = storedPassword.split('.')
      const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

      return buf.toString('hex') === hashedPassword
    } catch(err) {
      console.log(err)
    }
  }
}