import { HTTP_EXCEPTIONS } from '@api/constants';
import { env } from '@api/env';
import { CustomError, TokenUser } from '@api/types';
import { getToken } from '@api/utils';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const authMiddleware = async (
  req: unknown,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = req as unknown as Request;
    const token = getToken(request);

    if (token) {
      const isAccessToken = !!request.cookies['Authorization'];

      const verifiedUser = verify(
        token,
        isAccessToken
          ? env.ACCESS_TOKEN_SECRET_KEY
          : env.REFRESH_TOKEN_SECRET_KEY
      ) as TokenUser;

      request.user = verifiedUser;

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

      //   res.setHeader(
      //     'Set-Cookie',
      //     authService.createCookies({
      //       accessToken: accessToken,
      //     }),
      //   );
      // }

      next();
    } else {
      next(new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED));
    }
  } catch {
    next(new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING));
  }
};
