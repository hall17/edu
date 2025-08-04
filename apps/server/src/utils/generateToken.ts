import { env } from '@api/env';
import { sign } from 'jsonwebtoken';

export function generateToken(tokenData: object, expiresIn: number) {
  const token = sign(tokenData, env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn,
  });

  return token;
}
