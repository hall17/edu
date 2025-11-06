import { HTTP_EXCEPTIONS } from '@api/constants';
import { env } from '@api/env';
import { MiddlewareFunction } from '@api/trpc';
import { CustomError, TokenUser } from '@api/types';
import { getToken } from '@api/utils';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

export const authMiddleware: MiddlewareFunction = (opts) => {
  try {
    const token = getToken(opts.ctx.req as Request, { useCookie: true });

    if (!token) {
      throw new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
    }

    const isAccessToken = !!opts.ctx.req.cookies['Authorization'];

    const verifiedUser = verify(
      token,
      isAccessToken ? env.ACCESS_TOKEN_SECRET_KEY : env.REFRESH_TOKEN_SECRET_KEY
    ) as TokenUser;

    opts.ctx.req.user = {
      ...verifiedUser,
    };

    // if (!isAccessToken) {
    //   const accessToken = authService.createToken('access', {
    //     id: verifiedUser.id,
    //     email: verifiedUser.email,
    //     isAdmin: verifiedUser.isAdmin,
    //     branchIds: verifiedUser.branchIds,
    //     activeBranchId: verifiedUser.activeBranchId,
    //     roles: verifiedUser.roles,
    //     isSuperAdmin: verifiedUser.isSuperAdmin,
    //     isBranchManager: verifiedUser.isBranchManager,
    //     isModuleManager: verifiedUser.isModuleManager,
    //     isTeacher: verifiedUser.isTeacher,
    //     isStaff: verifiedUser.isStaff,
    //     userType: verifiedUser.userType,
    //     permissions: verifiedUser.permissions,
    //     firstName: verifiedUser.firstName,
    //     lastName: verifiedUser.lastName,
    //     name: verifiedUser.name,
    //   } as TokenUserData);

    //   opts.ctx.res.setHeader(
    //     'Set-Cookie',
    //     authService.createCookies({
    //       accessToken: accessToken,
    //     }),
    //   );
    // }

    // run your checks here

    return opts.next({
      ctx: {
        ...opts.ctx,
        user: verifiedUser,
      },
    });
  } catch {
    throw new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
  }
};

// export const authenticateTRPC: MiddlewareFunction = (opts) => {
//   const {
//     ctx: { req },
//     next,
//   } = opts;

//   try {
//     const token = getToken(req as Request, { useCookie: true });

//     if (!token) {
//       throw new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
//     }

//     const verifiedUser = verify(
//       token,
//       env.ACCESS_TOKEN_SECRET_KEY as string,
//     ) as User;

//     req.user = verifiedUser;

//     // run your checks here

//     return next();
//   } catch (err) {
//     throw new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
//   }
// };

export const authenticateTokenTRPC: (options: {
  query?: boolean;
  body?: boolean;
}) => MiddlewareFunction =
  (
    options: { query?: boolean; body?: boolean } = { query: true, body: false }
  ) =>
  (opts) => {
    try {
      const token =
        options.query && opts.ctx.req.query['token']
          ? String(opts.ctx.req.query['token'])
          : opts.ctx.req.body.token;

      if (!token) {
        throw new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
      }

      const verifiedUser = verifyToken(token);

      opts.ctx.req.user = verifiedUser;

      return opts.next({
        ctx: {
          ...opts.ctx,
          user: verifiedUser,
        },
      });
    } catch {
      throw new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
    }
  };

export function verifyToken(token: string) {
  try {
    const verifiedUser = verify(
      token,
      env.ACCESS_TOKEN_SECRET_KEY
    ) as TokenUser;
    return verifiedUser;
  } catch {
    throw new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
  }
}
