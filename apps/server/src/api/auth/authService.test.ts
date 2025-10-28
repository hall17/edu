import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma as prismaMock } from '@api/libs/__mocks__/prisma';
import { User } from '@api/prisma/generated/prisma/client';
import { TokenUser } from '@api/types';
import { CustomError } from '@api/types';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '@api/utils/constants';
import { sign } from 'jsonwebtoken';
import Container from 'typedi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService, TokenUserData } from './authService';

vi.mock('typedi', () => ({
  default: {
    get: vi.fn(),
  },
  Service: vi.fn(() => (target: unknown) => target), // Mock the Service decorator
}));
vi.mock('@api/libs/prisma');
vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
  verify: vi.fn(() => ({ id: '123' })),
}));

describe('authService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock Container.get to return a new AuthService instance
    vi.mocked(Container.get).mockReturnValue(new AuthService());
  });

  describe('createToken', () => {
    const TokenUserData = {
      id: '123',
      email: 'test@test.com',
      isAdmin: false,
    } as unknown as TokenUserData;

    it('should create an access token', () => {
      const authService = Container.get(AuthService);

      const token = authService.createToken('access', TokenUserData);
      console.log(token);
      expect(token).toBeDefined();
      expect(sign).toHaveBeenCalledTimes(1);
      expect(sign).toHaveBeenCalledWith(
        { ...TokenUserData, jti: expect.any(String), type: 'access' },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN } // 6 hour
      );
    });

    it('should create a refresh token', () => {
      const authService = Container.get(AuthService);

      const token = authService.createToken('refresh', TokenUserData);
      expect(token).toBeDefined();
      expect(sign).toHaveBeenCalledTimes(1);
      expect(sign).toHaveBeenCalledWith(
        { ...TokenUserData, jti: expect.any(String), type: 'refresh' },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN } // 7 days
      );
    });
  });

  describe('verify', () => {
    const mockUser = {
      id: '123',
      email: 'test@test.com',
      isAdmin: false,
      type: 'access' as const,
      jti: 'test-jti',
      isSuperAdmin: false,
      isBranchManager: false,
      isModuleManager: false,
      isStaff: false,
      isTeacher: false,
      branchIds: [],
      activeBranchId: 0,
      preferences: {
        theme: 'LIGHT',
        language: 'EN',
        notificationsEnabled: true,
      },
      name: 'test',
      roles: [],
      permissions: [],
      devices: [],
      userType: 'user',
      firstName: 'test',
      lastName: 'test',
      students: [],
    } as unknown as TokenUser;

    it('should return user email when user exists', async () => {
      const authService = Container.get(AuthService);

      prismaMock.user.findUnique.mockResolvedValue({
        email: 'test@test.com',
      } as User);

      const result = await authService.me(mockUser);

      expect(result).toEqual({ email: 'test@test.com' });
      expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        select: { email: true },
      });
    });

    it('should throw CustomError when user does not exist', async () => {
      const authService = Container.get(AuthService);

      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(authService.me(mockUser)).rejects.toThrow(
        new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND)
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        select: { email: true },
      });
    });
  });
});
