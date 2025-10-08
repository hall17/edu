import { HTTP_EXCEPTIONS } from '@api/constants';
import emailService from '@api/libs/emailService';
import { prisma } from '@api/libs/prisma';
import { generateSignedUrl } from '@api/libs/s3';
import { CustomError, TokenUser } from '@api/types';
import { decrypt, encrypt, generateToken, hasPermission } from '@api/utils';
import { INVITATION_EXPIRATION_TIME, PAGE_SIZE } from '@api/utils/constants';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { Prisma, Parent } from '@api/prisma/generated/prisma/client';
import { hash } from 'bcrypt';
import { Service } from 'typedi';

import {
  ParentCreateDto,
  ParentFindAllDto,
  ParentUpdateDto,
  ParentUpdateSuspendedDto,
} from './parentModel';

@Service()
export class ParentService {
  async findAll(requestedBy: TokenUser, filterDto: ParentFindAllDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.parents,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 0;
    let orderBy: Prisma.ParentOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order as Prisma.SortOrder };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.ParentWhereInput = {
      deletedAt: null,
      branchId:
        filterDto.global && requestedBy.isSuperAdmin
          ? requestedBy.branchIds.length
            ? { in: requestedBy.branchIds }
            : undefined
          : requestedBy.activeBranchId,
      status: {
        in: filterDto.status || undefined,
      },
      students: filterDto.noStudents ? { none: {} } : undefined,
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { nationalId: { contains: q, mode: 'insensitive' } },
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { phoneNumber: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [parents, count] = await Promise.all([
      prisma.parent.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          students: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.parent.count({
        where,
      }),
    ]);

    const parentsWithData = await Promise.all(
      parents.map(async (parent) => {
        return this.createParentData(requestedBy, parent);
      })
    );

    return {
      parents: parentsWithData,
      count,
    };
  }

  async findOne(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.parents,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const parent = await prisma.parent.findUnique({
      where: {
        id,
        deletedAt: null,
        branchId: requestedBy.activeBranchId,
      },
      include: {
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!parent) {
      throw new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    return this.createParentData(requestedBy, parent);
  }

  async create(requestedBy: TokenUser, dto: ParentCreateDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.parents,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const parents = await prisma.parent.findMany({
      where: {
        email: dto.email,
      },
    });

    if (parents.length) {
      throw new CustomError(
        HTTP_EXCEPTIONS.PARENT_WITH_THAT_EMAIL_ALREADY_EXISTS
      );
    }

    const encryptedNationalId = dto.nationalId
      ? encrypt(dto.nationalId)
      : undefined;

    const id = crypto.randomUUID();

    const tokenData = {
      id,
      email: dto.email,
      userType: 'parent',
      branchId: requestedBy.activeBranchId,
    };
    const token = generateToken(tokenData, INVITATION_EXPIRATION_TIME);
    const hashedToken = await hash(token, 10);

    const parent = await prisma.parent.create({
      data: {
        ...dto,
        nationalId: encryptedNationalId,
        password: crypto.randomUUID(),
        branchId: requestedBy.activeBranchId,
        tokens: {
          create: {
            type: 'INVITATION',
            token: hashedToken,
          },
        },
      },
    });

    await emailService.sendInvitationMail(
      {
        email: parent.email,
        userType: 'parent',
      },
      token
    );

    return this.createParentData(requestedBy, parent);
  }

  async update(requestedBy: TokenUser, dto: ParentUpdateDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.parents,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const parent = await prisma.parent.findUnique({
      where: {
        id: dto.id,
        branchId: requestedBy.activeBranchId,
      },
      select: { id: true },
    });

    if (!parent) {
      throw new CustomError(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    if (dto.nationalId) {
      dto.nationalId = encrypt(dto.nationalId);
    }

    const updatedParent = await prisma.parent.update({
      where: { id: dto.id },
      data: {
        ...dto,
        statusUpdatedAt: dto.status ? new Date() : undefined,
        statusUpdatedBy: dto.status ? requestedBy.id : undefined,
      },
    });

    return this.createParentData(requestedBy, updatedParent);
  }

  async delete(requestedBy: TokenUser, id: string) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.parents,
      PERMISSIONS.delete
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const payload = await prisma.parent.updateMany({
      where: {
        id,
        branchId: requestedBy.activeBranchId,
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

  async updateSuspended(requestedBy: TokenUser, dto: ParentUpdateSuspendedDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.parents,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const parent = await prisma.parent.update({
      where: { id: dto.id, branchId: requestedBy.activeBranchId },
      data: {
        ...dto,
        statusUpdatedAt: dto.status ? new Date() : undefined,
        statusUpdatedBy: dto.status ? requestedBy.id : undefined,
      },
      include: {
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return this.createParentData(requestedBy, parent);
  }

  private async createParentData(requestedBy: TokenUser, parent: Parent) {
    const { password: _, ...parentWithoutPassword } = parent;

    parentWithoutPassword.nationalId = parentWithoutPassword.nationalId
      ? decrypt(parentWithoutPassword.nationalId)
      : null;

    if (parentWithoutPassword.profilePictureUrl) {
      const url = await generateSignedUrl(
        'getObject',
        requestedBy.companyId!,
        requestedBy.activeBranchId,
        'profile-pictures',
        parentWithoutPassword.profilePictureUrl
      );
      parentWithoutPassword.profilePictureUrl = url;
    }

    return parentWithoutPassword;
  }
}
