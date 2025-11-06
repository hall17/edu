import { DEFAULT_LANGUAGE, HTTP_EXCEPTIONS } from '@api/constants';
import { env } from '@api/env';
import emailService from '@api/libs/emailService';
import { prisma } from '@api/libs/prisma';
import { prismaExclude } from '@api/libs/prisma/prismaExclude';
import {
  parentInclude,
  studentInclude,
  userAuthInclude,
} from '@api/libs/prisma/selections';
import { generateSignedUrl } from '@api/libs/s3';
import smsService from '@api/libs/smsService';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, Token, TokenUser } from '@api/types';
import { decrypt, encrypt, generateToken, hasPermission } from '@api/utils';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  INVITATION_EXPIRATION_TIME,
  RESET_PASSWORD_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRES_IN,
  OTP_EXPIRATION_TIME,
} from '@api/utils/constants';
import {
  MODULE_CODES,
  SYSTEM_ROLES,
  PERMISSIONS,
  USER_TYPES,
  UserType,
} from '@edusama/common';
import { compare, hash } from 'bcrypt';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import z from 'zod';

import { randomInt } from 'crypto';

import {
  CompleteSignupDto,
  LoginDto,
  ResetPasswordDto,
  SendInvitationEmailDto,
  SendOtpSmsDto,
  SendResetPasswordEmailDto,
  UpdateMeDto,
  UpdateUserPreferencesDto,
  VerifyTokenDto,
} from './authModel';

type CreateTokenUser =
  | Prisma.UserGetPayload<{
      include: ReturnType<typeof userAuthInclude>;
    }>
  | Prisma.StudentGetPayload<{
      include: typeof studentInclude;
    }>
  | Prisma.ParentGetPayload<{
      include: typeof parentInclude;
    }>;

export type TokenUserData = ReturnType<
  typeof AuthService.prototype.createTokenUserData
>;

@Service()
export class AuthService {
  async login(dto: LoginDto) {
    const [user, student, parent] = await Promise.all([
      prisma.user.findUnique({
        where: { email: dto.email },
        include: userAuthInclude(),
      }),
      prisma.student.findUnique({
        where: { email: dto.email },
        include: studentInclude,
      }),
      prisma.parent.findUnique({
        where: { email: dto.email },
        include: parentInclude,
      }),
    ]);

    const foundUser = user ?? student ?? parent;

    if (!foundUser) {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
    }

    if (foundUser?.status === 'SUSPENDED') {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_SUSPENDED);
    }

    if (foundUser?.status === 'INVITED') {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_INVITATION_NOT_COMPLETED);
    }

    if (student && student.status !== 'ACTIVE') {
      if (foundUser.status === 'REJECTED') {
        throw new CustomError(HTTP_EXCEPTIONS.STUDENT_REJECTED);
      }
      throw new CustomError(HTTP_EXCEPTIONS.STUDENT_NOT_APPROVED_YET);
    }

    const isPasswordMatching = await compare(dto.password, foundUser.password);

    if (!isPasswordMatching) {
      throw new CustomError(HTTP_EXCEPTIONS.WRONG_PASSWORD);
    }

    const tokenUserData = this.createTokenUserData(
      foundUser as CreateTokenUser
    );
    const { accessToken, refreshToken } = this.createTokenPair(tokenUserData);

    const cookies = this.createCookies({ accessToken, refreshToken });

    const userData = await this.createUserData(foundUser as CreateTokenUser);

    return {
      cookies,
      user: userData,
    };
  }

  async changeActiveBranch(requestedBy: TokenUser, branchId: number) {
    const user = await prisma.user.findUnique({
      where: { id: requestedBy.id },
      include: userAuthInclude(),
    });

    const isUserInBranch = user?.branches.some(
      (branch) => branch.branchId === branchId
    );

    if (!user || !isUserInBranch) {
      throw new CustomError(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
    }

    const tokenUserData = this.createTokenUserData(user as CreateTokenUser, {
      activeBranchId: branchId,
    });
    const { accessToken, refreshToken } = this.createTokenPair(tokenUserData);

    const cookies = this.createCookies({ accessToken, refreshToken });

    const userData = await this.createUserData(user as CreateTokenUser);

    return {
      cookies,
      user: userData,
    };
  }

  async me(requestedBy: TokenUser) {
    let maybeAccount;

    if (requestedBy.userType === 'user') {
      maybeAccount = await prisma.user.findUnique({
        where: {
          id: requestedBy.id,
          branches: { some: { branchId: requestedBy.activeBranchId } },
          status: 'ACTIVE',
        },
        include: userAuthInclude(),
      });
    } else if (requestedBy.userType === 'student') {
      maybeAccount = await prisma.student.findUnique({
        where: {
          id: requestedBy.id,
          branchId: requestedBy.activeBranchId,
          status: 'ACTIVE',
        },
        include: studentInclude,
      });
    } else if (requestedBy.userType === 'parent') {
      maybeAccount = await prisma.parent.findUnique({
        where: {
          id: requestedBy.id,
          branchId: requestedBy.activeBranchId,
          status: 'ACTIVE',
        },
        include: parentInclude,
      });
    }

    if (!maybeAccount) {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
    }

    if (maybeAccount.status === 'SUSPENDED') {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_SUSPENDED);
    }

    const userData = await this.createUserData(maybeAccount as CreateTokenUser);

    return userData;
  }

  async findAttendanceNotifications(requestedBy: TokenUser) {
    const attendanceNotifications =
      await prisma.attendanceNotification.findMany({
        where: {
          studentId: requestedBy.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          classroomIntegration: {
            select: {
              classroom: {
                select: {
                  id: true,
                  name: true,
                },
              },
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

    return attendanceNotifications;
  }

  async acknowledgeAttendanceNotification(requestedBy: TokenUser, id: string) {
    await prisma.attendanceNotification.update({
      where: { id, studentId: requestedBy.id },
      data: { status: 'ACKNOWLEDGED' },
    });

    return id;
  }

  async updateMe(req: Request, dto: UpdateMeDto) {
    const requestedBy = req.user;

    let maybeAccount = undefined;

    if (requestedBy.userType === 'user') {
      maybeAccount = await prisma.user.findUnique({
        where: {
          id: requestedBy.id,
          branches: { some: { branchId: requestedBy.activeBranchId } },
        },
        include: userAuthInclude(),
      });
    } else if (requestedBy.userType === 'student') {
      maybeAccount = await prisma.student.findUnique({
        where: {
          id: requestedBy.id,
          branchId: requestedBy.activeBranchId,
          status: 'ACTIVE',
        },
        include: studentInclude,
      });
    } else if (requestedBy.userType === 'parent') {
      maybeAccount = await prisma.parent.findUnique({
        where: { id: requestedBy.id, branchId: requestedBy.activeBranchId },
        include: parentInclude,
      });
    }

    if (!maybeAccount) {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
    }

    if (maybeAccount.status === 'SUSPENDED') {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_SUSPENDED);
    }

    if (dto.password) {
      // password validation rules:
      // 1. password must be at least 8 characters long
      // 2. password must contain at least one uppercase letter
      // 3. password must contain at least one lowercase letter
      // 4. password must contain at least one number
      // 5. password must contain at least one special character

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(dto.password)) {
        throw new CustomError(HTTP_EXCEPTIONS.INVALID_PASSWORD);
      }

      const isPasswordMatching = await compare(
        dto.password,
        maybeAccount.password
      );

      if (isPasswordMatching) {
        throw new CustomError(HTTP_EXCEPTIONS.SAME_PASSWORD);
      }

      const hashedPassword = await hash(dto.password, 10);
      dto.password = hashedPassword;
    }

    if (dto.nationalId) {
      dto.nationalId = encrypt(dto.nationalId);
    }

    let updatedAccount: CreateTokenUser | null = null;

    if (this.isUser(maybeAccount)) {
      updatedAccount = await prisma.user.update({
        where: { id: requestedBy.id },
        data: {
          ...dto,
          activityLogs: dto.password
            ? {
                create: {
                  action: 'PASSWORD_CHANGE',
                  ipAddress: req.ip,
                  deviceInfo: req.headers['user-agent'],
                  location: req.headers['x-forwarded-for'] as string,
                  browserInfo: req.headers['user-agent'],
                  osInfo: req.headers['user-agent'],
                  deviceType: req.headers['user-agent'],
                },
              }
            : undefined,
        },
        include: userAuthInclude(),
      });
    } else if (this.isStudent(maybeAccount)) {
      updatedAccount = await prisma.student.update({
        where: { id: requestedBy.id },
        data: {
          ...dto,
          activityLogs: dto.password
            ? {
                create: {
                  action: 'PASSWORD_CHANGE',
                  ipAddress: req.ip,
                  deviceInfo: req.headers['user-agent'],
                  location: req.headers['x-forwarded-for'] as string,
                  browserInfo: req.headers['user-agent'],
                  osInfo: req.headers['user-agent'],
                  deviceType: req.headers['user-agent'],
                },
              }
            : undefined,
        },
        include: studentInclude,
      });
    } else {
      updatedAccount = await prisma.parent.update({
        where: { id: requestedBy.id },
        data: {
          ...dto,
        },
        include: parentInclude,
      });
    }

    if (!updatedAccount) {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
    }

    const userData = await this.createUserData(
      updatedAccount as CreateTokenUser
    );

    return userData;
  }

  async updateUserPreferences(
    requestedBy: TokenUser,
    dto: UpdateUserPreferencesDto
  ) {
    let maybeAccount = undefined;

    if (requestedBy.userType === 'user') {
      maybeAccount = await prisma.user.findUnique({
        where: { id: requestedBy.id },
        include: userAuthInclude(),
      });
    } else if (requestedBy.userType === 'student') {
      maybeAccount = await prisma.student.findUnique({
        where: { id: requestedBy.id },
        include: studentInclude,
      });
    } else if (requestedBy.userType === 'parent') {
      maybeAccount = await prisma.parent.findUnique({
        where: { id: requestedBy.id },
        include: parentInclude,
      });
    }

    if (!maybeAccount) {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
    }

    if (maybeAccount.status === 'SUSPENDED') {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_SUSPENDED);
    }

    let updatedAccount = undefined;

    if (this.isUser(maybeAccount)) {
      updatedAccount = await prisma.user.update({
        where: { id: requestedBy.id },
        data: {
          preferences: {
            upsert: {
              where: { userId: requestedBy.id },
              update: { ...dto },
              create: {
                language: dto.language ?? DEFAULT_LANGUAGE,
                theme: dto.theme ?? 'LIGHT',
                notificationsEnabled: dto.notificationsEnabled ?? true,
              },
            },
          },
        },
        select: {
          preferences: {
            select: {
              language: true,
              theme: true,
              notificationsEnabled: true,
            },
          },
        },
      });
    } else if (this.isStudent(maybeAccount)) {
      updatedAccount = await prisma.student.update({
        where: { id: requestedBy.id },
        data: {
          preferences: {
            upsert: {
              where: { studentId: requestedBy.id },
              update: { ...dto },
              create: {
                language: dto.language ?? DEFAULT_LANGUAGE,
                theme: dto.theme ?? 'LIGHT',
                notificationsEnabled: dto.notificationsEnabled ?? true,
              },
            },
          },
        },
        select: {
          preferences: {
            select: {
              language: true,
              theme: true,
              notificationsEnabled: true,
            },
          },
        },
      });
    } else {
      updatedAccount = await prisma.parent.update({
        where: { id: requestedBy.id },
        data: {
          preferences: {
            upsert: {
              where: { parentId: requestedBy.id },
              update: { ...dto },
              create: {
                language: dto.language ?? DEFAULT_LANGUAGE,
                theme: dto.theme ?? 'LIGHT',
                notificationsEnabled: dto.notificationsEnabled ?? true,
              },
            },
          },
        },
        select: {
          preferences: {
            select: {
              language: true,
              theme: true,
              notificationsEnabled: true,
            },
          },
        },
      });
    }

    if (!updatedAccount) {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
    }

    return updatedAccount.preferences;
  }

  async logout(requestedBy: TokenUser) {
    let maybeAccount: null | { id: string; email: string } = null;

    if (requestedBy.userType === 'user') {
      maybeAccount = await prisma.user.findUnique({
        where: { id: requestedBy.id },
        select: { id: true, email: true },
      });
    } else if (requestedBy.userType === 'student') {
      maybeAccount = await prisma.student.findUnique({
        where: { id: requestedBy.id },
        select: { id: true, email: true },
      });
    } else if (requestedBy.userType === 'parent') {
      maybeAccount = await prisma.parent.findUnique({
        where: { id: requestedBy.id },
        select: { id: true, email: true },
      });
    }

    if (!maybeAccount) {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
    }
  }

  async sendResetPasswordEmail(
    requestedBy: TokenUser,
    dto: SendResetPasswordEmailDto
  ) {
    const module =
      dto.userType === 'user'
        ? MODULE_CODES.usersAndRoles
        : dto.userType === 'student'
          ? MODULE_CODES.students
          : MODULE_CODES.parents;

    const userHasPermission = hasPermission(
      requestedBy,
      module,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const branch = await prisma.branch.findUnique({
      where: {
        id: requestedBy.activeBranchId,
      },
      select: {
        users: {
          where: {
            userId: dto.id,
          },
          select: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        students: {
          where: {
            id: dto.id,
          },
          select: {
            id: true,
            email: true,
          },
        },
        parents: {
          where: {
            id: dto.id,
          },
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!branch) {
      throw new CustomError(HTTP_EXCEPTIONS.BRANCH_NOT_FOUND);
    }

    const [maybeAccount] = [
      ...branch.users.map((user) => user.user),
      ...branch.students,
      ...branch.parents,
    ];

    const userType =
      branch.users.length > 0
        ? 'user'
        : branch.students.length > 0
          ? 'student'
          : 'parent';

    if (!maybeAccount) {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
    }

    const token = generateToken(
      {
        id: maybeAccount.id,
        email: maybeAccount.email,
        userType: dto.userType,
      },
      RESET_PASSWORD_EXPIRATION_TIME
    );
    const hashedToken = await hash(token, 10);

    await prisma.$transaction(async (tx) => {
      await tx.token.deleteMany({
        where: {
          ...(userType === 'user' ? { userId: maybeAccount.id } : {}),
          ...(userType === 'student' ? { studentId: maybeAccount.id } : {}),
          ...(userType === 'parent' ? { parentId: maybeAccount.id } : {}),
          email: maybeAccount.email,
          type: 'RESET_PASSWORD',
          isUsed: false,
        },
      });

      // create token to allow user to reset password
      await tx.token.create({
        data: {
          ...(userType === 'user' ? { userId: maybeAccount.id } : {}),
          ...(userType === 'student' ? { studentId: maybeAccount.id } : {}),
          ...(userType === 'parent' ? { parentId: maybeAccount.id } : {}),
          email: maybeAccount.email,
          token: hashedToken,
          type: 'RESET_PASSWORD',
        },
      });

      try {
        await emailService.sendResetPasswordMail(maybeAccount.email, token);
      } catch {
        throw new CustomError(HTTP_EXCEPTIONS.FAILED_TO_SEND_EMAIL);
      }
    });
  }

  async sendInvitationEmail(
    requestedBy: TokenUser,
    dto: SendInvitationEmailDto
  ) {
    const module =
      dto.userType === 'user'
        ? MODULE_CODES.usersAndRoles
        : dto.userType === 'student'
          ? MODULE_CODES.students
          : MODULE_CODES.parents;

    const userHasPermission = hasPermission(
      requestedBy,
      module,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    // role id superior role granted permission check
    if (dto.roleIds?.length) {
      if (!requestedBy.isSuperAdmin && !requestedBy.isAdmin) {
        const userHasSameRole = dto.roleIds.every((roleId) => {
          const matchingRole = requestedBy.roles.find(
            (role) => role.id === roleId
          );

          return (
            matchingRole &&
            matchingRole?.branchId === requestedBy.activeBranchId
          );
        });

        if (!userHasSameRole) {
          throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
        }
      }
    }

    const branch = await prisma.branch.findUnique({
      where: {
        id: requestedBy.activeBranchId,
      },
      select: {
        roles: {
          where: {
            id: { in: dto.roleIds },
          },
        },
        users: {
          where: {
            user: {
              email: dto.email,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        students: {
          where: {
            email: dto.email,
          },
          select: {
            id: true,
            email: true,
          },
        },
        parents: {
          where: {
            email: dto.email,
          },
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!branch) {
      throw new CustomError(HTTP_EXCEPTIONS.BRANCH_NOT_FOUND);
    }

    if (
      !dto.isResend &&
      (branch.users.length || branch.students.length || branch.parents.length)
    ) {
      throw new CustomError(
        HTTP_EXCEPTIONS.ACCOUNT_WITH_THAT_EMAIL_ALREADY_EXISTS
      );
    }

    const existingAccount =
      branch.users.length > 0
        ? branch.users[0]?.user
        : branch.students.length > 0
          ? branch.students[0]
          : branch.parents[0];

    const id = crypto.randomUUID();

    await prisma.$transaction(
      async (tx) => {
        // hash token
        const tokenData = {
          id,
          email: dto.email,
          userType: dto.userType,
          branchId: requestedBy.activeBranchId,
          roleIds: dto.roleIds,
        };
        const token = generateToken(tokenData, INVITATION_EXPIRATION_TIME);
        const hashedToken = await hash(token, 10);

        await tx.token.deleteMany({
          where: {
            email: dto.email,
            type: 'INVITATION',
            isUsed: false,
          },
        });

        let createdAccount;

        if (!dto.isResend) {
          if (dto.userType === 'user') {
            createdAccount = await tx.user.create({
              data: {
                status: 'INVITED',
                id,
                email: dto.email,
                firstName: dto.firstName ?? '',
                lastName: dto.lastName ?? '',
                password: crypto.randomUUID(),
                branches: {
                  create: {
                    branchId: requestedBy.activeBranchId,
                  },
                },
                roles: {
                  createMany: {
                    data:
                      dto.roleIds?.map((roleId) => {
                        return {
                          roleId,
                        };
                      }) ?? [],
                  },
                },
              },
            });
          } else if (dto.userType === 'student') {
            createdAccount = await tx.student.create({
              data: {
                status: 'INVITED',
                id,
                firstName: dto.firstName ?? '',
                lastName: dto.lastName ?? '',
                email: dto.email,
                password: crypto.randomUUID(),
                branchId: requestedBy.activeBranchId,
              },
            });
          } else {
            createdAccount = await tx.parent.create({
              data: {
                status: 'INVITED',
                id,
                email: dto.email,
                firstName: dto.firstName ?? '',
                lastName: dto.lastName ?? '',
                password: crypto.randomUUID(),
                branchId: requestedBy.activeBranchId,
              },
            });
          }
        } else {
          createdAccount = existingAccount!;
        }

        // create token to allow user to complete signup
        await tx.token.create({
          data: {
            ...(dto.userType === 'user' ? { userId: createdAccount.id } : {}),
            ...(dto.userType === 'student'
              ? { studentId: createdAccount.id }
              : {}),
            ...(dto.userType === 'parent'
              ? { parentId: createdAccount.id }
              : {}),
            token: hashedToken,
            type: 'INVITATION',
          },
        });

        try {
          await emailService.sendInvitationMail(dto, token);
        } catch {
          throw new CustomError(HTTP_EXCEPTIONS.FAILED_TO_SEND_EMAIL);
        }
      },
      { timeout: 30000 }
    );
  }

  async sendOtpSms(_requestedBy: TokenUser, dto: SendOtpSmsDto) {
    let maybeAccount;

    if (dto.userType === 'user') {
      maybeAccount = await prisma.user.findUnique({
        where: { id: dto.id },
      });
    } else if (dto.userType === 'student') {
      maybeAccount = await prisma.student.findUnique({
        where: { id: dto.id },
      });
    } else if (dto.userType === 'parent') {
      maybeAccount = await prisma.parent.findUnique({
        where: { id: dto.id },
      });
    }

    if (!maybeAccount) {
      throw new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    if (maybeAccount.status === 'SUSPENDED') {
      throw new CustomError(HTTP_EXCEPTIONS.ACCOUNT_SUSPENDED);
    }

    // generate 6 digit otp
    const otp = randomInt(100000, 999999);

    const token = generateToken(
      {
        id: maybeAccount.id,
        email: maybeAccount.email,
        userType: dto.userType,
        otp,
      },
      OTP_EXPIRATION_TIME
    );

    await prisma.$transaction(async (tx) => {
      await tx.token.deleteMany({
        where: {
          email: maybeAccount.email,
          type: 'OTP',
        },
      });

      await tx.token.create({
        data: {
          token,
          type: 'OTP',
          ...(dto.userType === 'user' ? { userId: maybeAccount.id } : {}),
          ...(dto.userType === 'student' ? { studentId: maybeAccount.id } : {}),
          ...(dto.userType === 'parent' ? { parentId: maybeAccount.id } : {}),
        },
      });

      try {
        await smsService.sendOtp({
          phoneNumber: maybeAccount.phoneNumber,
          code: otp.toString(),
        });
      } catch {
        throw new CustomError(HTTP_EXCEPTIONS.FAILED_TO_SEND_SMS);
      }
    });
  }

  async verifyToken(requestedBy: TokenUser, dto: VerifyTokenDto) {
    const token = await prisma.token.findFirst({
      where: {
        type: dto.type,
        isUsed: false,
        OR: [
          requestedBy.userType === 'user' ? { userId: requestedBy.id } : {},
          requestedBy.userType === 'student'
            ? { studentId: requestedBy.id }
            : {},
          requestedBy.userType === 'parent' ? { parentId: requestedBy.id } : {},
          { email: requestedBy.email },
        ],
      },
    });

    if (!token) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const isTokenMatching = await compare(dto.token, token.token);

    if (!isTokenMatching) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    if (token.type === 'INVITATION') {
      const student = await prisma.student.findUnique({
        where: { id: requestedBy.id },
        select: prismaExclude('Student', ['password']),
      });

      if (student?.status === 'REQUESTED_CHANGES') {
        const decryptedNationalId = student?.nationalId
          ? decrypt(student?.nationalId)
          : undefined;

        return { ...student, nationalId: decryptedNationalId };
      }
    }

    return { email: requestedBy.email, type: token.type };
  }

  async completeSignup(requestedBy: TokenUser, dto: CompleteSignupDto) {
    let maybeAccount;

    if (requestedBy.userType === 'user') {
      maybeAccount = await prisma.user.findUnique({
        where: {
          email: dto.email,
          branches: { some: { branchId: requestedBy.activeBranchId } },
        },
        select: {
          id: true,
          email: true,
          tokens: {
            where: {
              type: { in: ['RESET_PASSWORD', 'INVITATION'] },
              isUsed: false,
            },
            select: {
              id: true,
              token: true,
            },
            take: 1,
          },
        },
      });
    } else if (requestedBy.userType === 'student') {
      maybeAccount = await prisma.student.findUnique({
        where: {
          email: dto.email,
          status: { notIn: ['REJECTED', 'ACTIVE', 'SUSPENDED'] },
        },
        select: {
          id: true,
          email: true,
          tokens: {
            where: {
              type: { in: ['RESET_PASSWORD', 'INVITATION'] },
              isUsed: false,
            },
            select: {
              id: true,
              token: true,
            },
            take: 1,
          },
        },
      });
    } else {
      maybeAccount = await prisma.parent.findUnique({
        where: { email: dto.email },
        select: {
          id: true,
          email: true,
          tokens: {
            where: {
              type: { in: ['RESET_PASSWORD', 'INVITATION'] },
              isUsed: false,
            },
            select: {
              id: true,
              token: true,
            },
            take: 1,
          },
        },
      });
    }

    if (!maybeAccount) {
      throw new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    const token = maybeAccount.tokens[0];

    if (!token) {
      throw new CustomError(HTTP_EXCEPTIONS.RESET_PASSWORD_TOKEN_NOT_FOUND);
    }

    const isTokenMatching = await compare(dto.token, token.token);

    if (!isTokenMatching) {
      throw new CustomError(HTTP_EXCEPTIONS.RESET_PASSWORD_TOKEN_NOT_FOUND);
    }

    const uuidSchema = z.uuid();

    const isPasswordUuid = uuidSchema.safeParse(dto.password).success;

    if (isPasswordUuid && !dto.password) {
      throw new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    await prisma.$transaction(
      async (tx) => {
        const hashedPassword = dto.password
          ? await hash(dto.password, 10)
          : undefined;

        const encryptedNationalId = dto.nationalId
          ? encrypt(dto.nationalId)
          : undefined;

        let updatedUser;

        const { token: _, ...rest } = dto;
        if (requestedBy.userType === 'user') {
          updatedUser = await tx.user.update({
            where: { id: maybeAccount.id },
            data: {
              ...rest,
              status: 'ACTIVE',
              password: hashedPassword,
              nationalId: encryptedNationalId,
              tokens: {
                update: {
                  where: { id: token.id },
                  data: { isUsed: true },
                },
              },
            },
            include: userAuthInclude(),
          });
        } else if (requestedBy.userType === 'student') {
          updatedUser = await tx.student.update({
            where: { id: maybeAccount.id },
            data: {
              ...rest,
              status: 'REQUESTED_APPROVAL',
              password: hashedPassword,
              nationalId: encryptedNationalId,
              tokens: {
                update: {
                  where: { id: token.id },
                  data: { isUsed: true },
                },
              },
            },
            include: studentInclude,
          });
        } else {
          updatedUser = await tx.parent.update({
            where: { id: maybeAccount.id },
            data: {
              ...rest,
              status: 'ACTIVE',
              password: hashedPassword,
              nationalId: encryptedNationalId,
              tokens: {
                update: {
                  where: { id: token.id },
                  data: { isUsed: true },
                },
              },
            },
            include: parentInclude,
          });
        }

        return updatedUser;
      },
      { timeout: 30000 }
    );

    return {
      userType: requestedBy.userType,
    };
  }

  async resetPassword(requestedBy: TokenUser, dto: ResetPasswordDto) {
    let foundUser;

    if (requestedBy.userType === 'user') {
      foundUser = await prisma.user.findUnique({
        where: {
          id: requestedBy.id,
          branches: { some: { branchId: requestedBy.activeBranchId } },
        },
        select: {
          id: true,
          email: true,
          tokens: {
            where: {
              type: { in: ['RESET_PASSWORD', 'INVITATION'] },
              isUsed: false,
            },
            select: {
              id: true,
              token: true,
            },
            take: 1,
          },
        },
      });
    } else if (requestedBy.userType === 'student') {
      foundUser = await prisma.student.findUnique({
        where: { id: requestedBy.id },
        select: {
          id: true,
          email: true,
          tokens: {
            where: {
              type: { in: ['RESET_PASSWORD', 'INVITATION'] },
              isUsed: false,
            },
            select: {
              id: true,
              token: true,
            },
            take: 1,
          },
        },
      });
    } else if (requestedBy.userType === 'parent') {
      foundUser = await prisma.parent.findUnique({
        where: { id: requestedBy.id },
        select: {
          id: true,
          email: true,
          tokens: {
            where: {
              type: { in: ['RESET_PASSWORD', 'INVITATION'] },
              isUsed: false,
            },
            select: {
              id: true,
              token: true,
            },
            take: 1,
          },
        },
      });
    }

    if (!foundUser) {
      throw new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    const token = foundUser.tokens[0];

    if (!token) {
      throw new CustomError(HTTP_EXCEPTIONS.RESET_PASSWORD_TOKEN_NOT_FOUND);
    }

    const isTokenMatching = await compare(dto.token, token.token);

    if (!isTokenMatching) {
      throw new CustomError(HTTP_EXCEPTIONS.RESET_PASSWORD_TOKEN_NOT_FOUND);
    }

    const user = await prisma.$transaction(
      async (tx) => {
        const hashedPassword = await hash(dto.password, 10);

        let updatedUser;

        if (requestedBy.userType === 'user') {
          updatedUser = await tx.user.update({
            where: { id: foundUser.id },
            data: {
              password: hashedPassword,
              tokens: {
                update: {
                  where: { id: token.id },
                  data: { isUsed: true },
                },
              },
            },
            include: userAuthInclude(),
          });
        } else if (requestedBy.userType === 'student') {
          updatedUser = await tx.student.update({
            where: { id: foundUser.id },
            data: {
              password: hashedPassword,
              tokens: {
                update: {
                  where: { id: token.id },
                  data: { isUsed: true },
                },
              },
            },
            include: studentInclude,
          });
        } else {
          updatedUser = await tx.parent.update({
            where: { id: foundUser.id },
            data: {
              password: hashedPassword,
              tokens: {
                update: {
                  where: { id: token.id },
                  data: { isUsed: true },
                },
              },
            },
            include: parentInclude,
          });
        }

        return updatedUser;
      },
      { timeout: 30000 }
    );

    const tokenUserData = this.createTokenUserData(user as CreateTokenUser);
    const tokenData = this.createToken(
      'access',
      this.createTokenUserData(user)
    );

    const cookies = this.createCookies({ accessToken: tokenData });

    return {
      cookies,
      user: tokenUserData,
    };
  }

  createToken(type: 'access' | 'refresh', tokenUserData: TokenUserData): Token {
    const expiresIn: number =
      type === 'access' ? ACCESS_TOKEN_EXPIRES_IN : REFRESH_TOKEN_EXPIRES_IN;

    return {
      expiresIn,
      token: sign(
        { ...tokenUserData, jti: crypto.randomUUID(), type },
        type === 'access'
          ? env.ACCESS_TOKEN_SECRET_KEY
          : env.REFRESH_TOKEN_SECRET_KEY,
        {
          expiresIn,
        }
      ),
    };
  }

  createCookies(tokenData: {
    accessToken?: Token;
    refreshToken?: Token;
  }): string[] {
    const cookieOptions = 'Path=/; HttpOnly; SameSite=None; Secure;';

    if (tokenData.accessToken && tokenData.refreshToken) {
      return [
        `Authorization=${tokenData.accessToken.token}; Path=/; Max-Age=${tokenData.accessToken.expiresIn}; ${cookieOptions}`,
        `RefreshToken=${tokenData.refreshToken.token}; Path=/; Max-Age=${tokenData.refreshToken.expiresIn}; ${cookieOptions}`,
      ];
    } else if (tokenData.accessToken) {
      return [
        `Authorization=${tokenData.accessToken.token}; Path=/; Max-Age=${tokenData.accessToken.expiresIn}; ${cookieOptions}`,
      ];
    } else if (tokenData.refreshToken) {
      return [
        `RefreshToken=${tokenData.refreshToken.token}; Path=/; Max-Age=${tokenData.refreshToken.expiresIn}; ${cookieOptions}`,
      ];
    }

    return [];
  }

  private createTokenPair(tokenUserData: TokenUserData) {
    const accessToken = this.createToken('access', tokenUserData);
    const refreshToken = this.createToken('refresh', tokenUserData);

    return {
      accessToken,
      refreshToken,
    };
  }

  private isUser(user: any): user is Prisma.UserGetPayload<{
    include: ReturnType<typeof userAuthInclude>;
  }> {
    return 'roles' in user;
  }

  private isStudent(user: any): user is Prisma.StudentGetPayload<{
    include: typeof studentInclude;
  }> {
    return 'parent' in user;
  }

  private isParent(user: any): user is Prisma.ParentGetPayload<{
    include: typeof parentInclude;
  }> {
    return 'students' in user;
  }

  createTokenUserData(
    user: CreateTokenUser,
    options: {
      activeBranchId?: number;
    } = {}
  ) {
    const maybeUser = this.isUser(user) ? user : null;
    const maybeStudent = this.isStudent(user) ? user : null;
    const maybeParent = this.isParent(user) ? user : null;
    const activeBranchId =
      options.activeBranchId ??
      maybeUser?.branches[0]?.branchId ??
      maybeStudent?.branchId ??
      maybeParent?.branchId ??
      -1;
    const activeBranch =
      maybeUser?.branches[0]?.branch ??
      maybeStudent?.branch ??
      maybeParent?.branch;
    const companyId = activeBranch
      ? 'company' in activeBranch
        ? activeBranch.company.id
        : activeBranch?.companyId
      : null;
    const userType: UserType = maybeUser
      ? USER_TYPES.user
      : maybeStudent
        ? USER_TYPES.student
        : USER_TYPES.parent;

    return {
      id: user?.id,
      email: user?.email,
      userType,
      activeBranchId,
      companyId,
      branchIds: maybeUser?.branches?.map((branch) => branch.branchId) ?? [],
      roles:
        maybeUser?.roles?.map((role) => {
          return {
            id: role.role.id,
            code: role.role.code,
            name: role.role.name,
            description: role.role.description,
            isSystem: role.role.isSystem,
            isVisible: role.role.isVisible,
            branchId: role.role.branchId,
            module: {
              id: role.module?.id,
              code: role.module?.code,
              name: role.module?.name,
            },
          };
        }) ?? [],
      isSuperAdmin:
        maybeUser?.roles?.some(
          (role) => role.role.code === SYSTEM_ROLES.superAdmin
        ) ?? false,
      isAdmin:
        maybeUser?.roles?.some(
          (role) => role.role.code === SYSTEM_ROLES.admin
        ) ?? false,
      isBranchManager:
        maybeUser?.roles?.some(
          (role) => role.role.code === SYSTEM_ROLES.branchManager
        ) ?? false,
      isModuleManager:
        maybeUser?.roles?.some(
          (role) => role.role.code === SYSTEM_ROLES.moduleManager
        ) ?? false,
      isStaff:
        maybeUser?.roles?.some(
          (role) => role.role.code === SYSTEM_ROLES.staff
        ) ?? false,
      isTeacher:
        maybeUser?.roles?.some(
          (role) => role.role.code === SYSTEM_ROLES.teacher
        ) ?? false,

      permissions: [
        ...new Set(
          maybeUser?.roles?.flatMap((role) =>
            role.role.permissions.map(
              (permission) =>
                `${role.role.branchId}:${permission.permission.module.code}:${permission.permission.name}`
            )
          )
        ),
      ],
    };
  }

  async createUserData(
    user: CreateTokenUser,
    options: {
      activeBranchId?: number;
    } = {}
  ) {
    const maybeUser = this.isUser(user) ? user : null;
    const maybeStudent = this.isStudent(user) ? user : null;
    const maybeParent = this.isParent(user) ? user : null;
    const companyId =
      maybeUser?.branches[0]?.branch.companyId ??
      maybeStudent?.branch.companyId ??
      maybeParent?.branch.companyId ??
      -1;
    const activeBranchId =
      options.activeBranchId ??
      maybeUser?.branches[0]?.branchId ??
      maybeStudent?.branchId ??
      maybeParent?.branchId ??
      -1;
    const activeBranch =
      maybeUser?.branches[0]?.branch ??
      maybeStudent?.branch ??
      maybeParent?.branch;
    const userType: UserType = maybeUser
      ? USER_TYPES.user
      : maybeStudent
        ? USER_TYPES.student
        : USER_TYPES.parent;
    const decryptedNationalId = user?.nationalId
      ? decrypt(user?.nationalId)
      : null;

    if (user.profilePictureUrl) {
      const url = await generateSignedUrl(
        'getObject',
        companyId,
        activeBranchId,
        'profile-pictures',
        user.profilePictureUrl
      );
      user.profilePictureUrl = url;
    }

    const { password: _, ...userWithoutPassword } = user;

    const tokenUserData = this.createTokenUserData(user);

    if (maybeUser?.branches) {
      await Promise.all(
        maybeUser.branches.map(async (branch) => {
          if (branch.branch.logoUrl) {
            const url = await generateSignedUrl(
              'getObject',
              companyId,
              branch.branch.id,
              undefined,
              branch.branch.logoUrl
            );

            branch.branch.logoUrl = url;
          }
        })
      );
    }

    return {
      ...tokenUserData,
      ...userWithoutPassword,
      nationalId: decryptedNationalId,
      userType,
      activeBranch,
      activeBranchId,
      fullName: [user?.firstName, user?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim(),
      devices: maybeUser?.devices,
      branches: maybeUser?.branches,
      preferences: {
        theme: maybeUser?.preferences?.theme,
        language: maybeUser?.preferences?.language,
        notificationsEnabled: maybeUser?.preferences?.notificationsEnabled,
      },
    };
  }
}
