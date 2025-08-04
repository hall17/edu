import { env } from '@api/env';

import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const key = crypto
  .createHash('sha512')
  .update(env.ENCRYPTION_KEY)
  .digest('hex')
  .substring(0, 32);

const iv = crypto.randomBytes(16);

// Encrypt function
export function encrypt(data: string) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(data, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  // Package the IV and encrypted data together so it can be stored in a single
  // column in the database.
  return iv.toString('hex') + encrypted;
}
