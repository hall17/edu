import { HTTP_EXCEPTIONS } from '@api/constants';
import emailService from '@api/libs/emailService';
import { prisma } from '@api/libs/prisma';
import { userAuthInclude } from '@api/libs/prisma/selections';
import { deleteS3Object, generateSignedUrl } from '@api/libs/s3';
import { Prisma, User } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { decrypt, encrypt, generateToken, hasPermission } from '@api/utils';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { hash } from 'bcrypt';
import { Service } from 'typedi';

import { INVITATION_EXPIRATION_TIME, PAGE_SIZE } from '../../utils/constants';

import {
  UserCreateDto,
  UserFindAllDto,
  UserUpdateDto,
  UserUpdateSuspendedDto,
} from './userModel';

@Service()
export class UserService {
  async findAll(requestedBy: TokenUser, filterDto: UserFindAllDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.usersAndRoles,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 1;
    let orderBy: Prisma.UserOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.UserOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.UserWhereInput = {
      deletedAt: null,
      roles: {
        some: {
          role: {
            code: filterDto.roleCodes
              ? {
                  in: filterDto.roleCodes,
                }
              : undefined,
            id: filterDto.roleIds
              ? {
                  in: filterDto.roleIds,
                }
              : undefined,
          },
        },
      },
      branches:
        filterDto.global && requestedBy.isSuperAdmin
          ? filterDto.branchIds?.length
            ? {
                some: {
                  branchId: {
                    in: filterDto.branchIds,
                  },
                },
              }
            : undefined
          : { some: { branchId: requestedBy.activeBranchId } },
      status: {
        in: filterDto.status || undefined,
      },
      taughtSubjects: filterDto.taughtSubjectIds?.length
        ? { some: { subjectId: { in: filterDto.taughtSubjectIds } } }
        : undefined,
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { firstName: { contains: q, mode: 'insensitive' } },
          { nationalId: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { phoneNumber: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [users, count] = await Promise.all([
      prisma.user.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: userAuthInclude({ branchId: requestedBy.activeBranchId }),
      }),
      prisma.user.count({
        where,
      }),
    ]);

    const usersWithData = await Promise.all(
      users.map(async (user) => {
        return this.createUserData(requestedBy, user);
      })
    );

    return {
      users: usersWithData,
      count,
    };
  }

  async findOne(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.usersAndRoles,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
        branches: requestedBy.isSuperAdmin
          ? undefined
          : { some: { branchId: requestedBy.activeBranchId } },
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    return this.createUserData(requestedBy, user);
  }

  async create(requestedBy: TokenUser, dto: UserCreateDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    if (dto.branchId) {
      const isUserAuthorized =
        requestedBy.isSuperAdmin ||
        requestedBy.branchIds.includes(dto.branchId);

      if (!isUserAuthorized) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const users = await prisma.user.findMany({
      where: {
        email: dto.email,
      },
    });

    if (users.length) {
      throw new CustomError(
        HTTP_EXCEPTIONS.USER_WITH_THAT_EMAIL_ALREADY_EXISTS
      );
    }

    const password = crypto.randomUUID();
    const hashedPassword = await hash(password, 10);
    const encryptedNationalId = dto.nationalId
      ? encrypt(dto.nationalId)
      : undefined;

    const id = crypto.randomUUID();

    const tokenData = {
      id,
      email: dto.email,
      userType: 'user',
      branchId: requestedBy.activeBranchId,
    };

    const token = generateToken(tokenData, INVITATION_EXPIRATION_TIME);
    const hashedToken = await hash(token, 10);

    const { taughtSubjectIds, ...userData } = dto;

    if (dto.profilePictureUrl) {
      dto.profilePictureUrl = id;
    }

    const user = await prisma.user.create({
      data: {
        ...userData,
        id,
        password: hashedPassword,
        nationalId: encryptedNationalId,
        tokens: {
          create: {
            type: 'INVITATION',
            token: hashedToken,
          },
        },
        taughtSubjects: taughtSubjectIds?.length
          ? {
              createMany: {
                data: taughtSubjectIds.map((subjectId) => ({ subjectId })),
              },
            }
          : undefined,
      },
      include: {
        tokens: true,
      },
    });

    if (dto.profilePictureUrl) {
      const signedAwsS3Url = await this.createSignedAwsS3Url(
        'putObject',
        requestedBy,
        id
      );

      return {
        ...user,
        signedAwsS3Url,
      };
    }

    // send invitation email
    await emailService.sendInvitationMail(
      {
        email: user.email,
        userType: 'user',
      },
      token
    );

    const { tokens: _, ...userWithoutTokens } = user;

    return this.createUserData(requestedBy, userWithoutTokens);
  }

  async update(requestedBy: TokenUser, dto: UserUpdateDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: dto.id,
        branches: requestedBy.isSuperAdmin
          ? undefined
          : { some: { branchId: requestedBy.activeBranchId } },
      },
      select: {
        id: true,
        taughtSubjects: {
          select: {
            subjectId: true,
          },
        },
      },
    });

    if (!user) {
      throw new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    if (dto.password) {
      dto.password = await hash(dto.password, 10);
    }

    if (dto.nationalId) {
      dto.nationalId = encrypt(dto.nationalId);
    }

    if (dto.profilePictureUrl) {
      dto.profilePictureUrl = dto.id;
    } else if (dto.profilePictureUrl === null) {
      // delete profile picture from s3
      await deleteS3Object(
        requestedBy.companyId!,
        requestedBy.activeBranchId,
        'profile-pictures',
        dto.id
      );
    }

    const { taughtSubjectIds, ...userData } = dto;

    if (taughtSubjectIds) {
      const existingSubjectIds = user.taughtSubjects.map(
        (subject) => subject.subjectId
      );

      const newSubjectIds = taughtSubjectIds?.filter(
        (subjectId) => !existingSubjectIds.includes(subjectId)
      );

      const deletedSubjectIds = existingSubjectIds.filter(
        (subjectId) => !taughtSubjectIds?.includes(subjectId)
      );

      if (newSubjectIds.length) {
        await prisma.subjectTeacher.createMany({
          data: newSubjectIds.map((subjectId) => ({
            subjectId,
            teacherId: user.id,
          })),
        });
      }

      if (deletedSubjectIds.length) {
        await prisma.subjectTeacher.deleteMany({
          where: { subjectId: { in: deletedSubjectIds }, teacherId: user.id },
        });
      }
    }
    const updatedUser = await prisma.user.update({
      where: { id: dto.id },
      data: {
        ...userData,
        statusUpdatedAt: dto.status ? new Date() : undefined,
        statusUpdatedBy: dto.status ? requestedBy.id : undefined,
      },
      include: userAuthInclude({ branchId: requestedBy.activeBranchId }),
    });

    if (dto.profilePictureUrl) {
      const signedAwsS3Url = await this.createSignedAwsS3Url(
        'putObject',
        requestedBy,
        dto.id
      );

      return {
        ...updatedUser,
        signedAwsS3Url,
      };
    }

    return this.createUserData(requestedBy, updatedUser);
  }

  async delete(requestedBy: TokenUser, id: string) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.delete
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const payload = await prisma.user.updateMany({
      where: {
        id,
        branches: requestedBy.isSuperAdmin
          ? undefined
          : { some: { branchId: requestedBy.activeBranchId } },
      },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    if (payload.count === 0) {
      throw new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    return id;
  }

  async deletePermanently(requestedBy: TokenUser, id: string) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.delete
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        branches: { some: { branchId: requestedBy.activeBranchId } },
      },
      select: { profilePictureUrl: true },
    });

    if (user?.profilePictureUrl) {
      await deleteS3Object(
        requestedBy.companyId!,
        requestedBy.activeBranchId,
        'profile-pictures',
        user.profilePictureUrl
      );
    }

    await prisma.user.delete({
      where: {
        id,
        branches: { some: { branchId: requestedBy.activeBranchId } },
      },
    });

    return id;
  }

  async updateSuspended(requestedBy: TokenUser, dto: UserUpdateSuspendedDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const user = await prisma.user.update({
      where: {
        id: dto.id,
        branches: requestedBy.isSuperAdmin
          ? undefined
          : { some: { branchId: requestedBy.activeBranchId } },
      },
      data: {
        ...dto,
        statusUpdatedAt: dto.status ? new Date() : undefined,
        statusUpdatedBy: dto.status ? requestedBy.id : undefined,
      },
      include: userAuthInclude({ branchId: requestedBy.activeBranchId }),
    });

    return this.createUserData(requestedBy, user);
  }

  private async createUserData<T extends User>(
    requestedBy: TokenUser,
    user: T
  ) {
    const { password: _, ...userWithoutPassword } = user;

    if (userWithoutPassword.profilePictureUrl) {
      const url = await this.createSignedAwsS3Url(
        'getObject',
        requestedBy,
        userWithoutPassword.profilePictureUrl
      );
      userWithoutPassword.profilePictureUrl = url;
    }

    userWithoutPassword.nationalId = userWithoutPassword.nationalId
      ? decrypt(userWithoutPassword.nationalId)
      : null;

    return userWithoutPassword;
  }

  private async createSignedAwsS3Url(
    operation: 'getObject' | 'putObject',
    requestedBy: TokenUser,
    url: string
  ) {
    return await generateSignedUrl({
      operation,
      companyId: requestedBy.companyId!,
      branchId: requestedBy.activeBranchId,
      folder: 'profile-pictures',
      key: url,
    });
  }
}
