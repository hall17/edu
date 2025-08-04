// @ts-nocheck
import { authMiddleware } from '@api/middlewares/rest/authMiddleware';
import { ApiContract } from '@api/ts-rest/apiContract';
import { RouterImplementation } from '@ts-rest/express/src/lib/types';
import Container from 'typedi';

import { AuthService } from './authService';

const authService = Container.get(AuthService);

export const authRouterImplementation: RouterImplementation<
  ApiContract['auth']
> = {
  login: async ({ body, res }) => {
    const { cookies, user } = await authService.login(body);
    res.setHeader('Set-Cookie', cookies);

    return {
      status: 200,
      body: user,
    };
  },
  logout: {
    middleware: [authMiddleware],
    handler: async ({ req, res }) => {
      const user = await authService.logout(req.user);
      res.setHeader('Set-Cookie', [
        'Authorization=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure;',
        'RefreshToken=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure;',
      ]);
      return {
        status: 200,
        body: user,
      };
    },
  },
  verify: {
    middleware: [authMiddleware],
    handler: async ({ req }) => {
      const user = await authService.verify(req.user);
      return {
        status: 200,
        body: user,
      };
    },
  },
};
