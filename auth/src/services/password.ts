import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  // hash password
  static async toHash(password: string) {
    // get a random string
    const salt = randomBytes(8).toString('hex');

    // hash the password with salt then return as Buffer type
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    // join the hashed password with salt
    return `${buf.toString('hex')}.${salt}`;
  }

  // compare password
  static async compare(storedPassword: string, suppliedPassword: string) {
    // extract the storedPassword
    const [hashedPassword, salt] = storedPassword.split('.');

    // hash the supplied password
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    // return the comparison reult
    return buf.toString('hex') === hashedPassword;
  }
}

// to use
// Password.toHash()
// Password.compare()
