import { Request } from 'express';

type GetTokenOptions = {
  useCookie: boolean;
};

export function getToken(
  req: Request,
  options: GetTokenOptions = { useCookie: true }
): string | null {
  if (options.useCookie) {
    return req.cookies['Authorization'] || req.cookies['RefreshToken'];
  }

  // disable bearer token
  const header = req.header('Authorization');

  if (header) {
    return header.split('Bearer ')[1];
  }

  return null;
}
