import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { titleInclude } from '@api/libs/prisma/selections';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { hasPermission } from '@api/utils';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';

import { TitleCreateDto, TitleFindAllDto, TitleUpdateDto } from './titleModel';

@Service()
export class TitleService {
  async findAll(requestedBy: TokenUser, filterDto: TitleFindAllDto) {
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

    const page = filterDto.page || 0;
    let orderBy: Prisma.TitleOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order as Prisma.SortOrder };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.TitleWhereInput = {};

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    if (filterDto.name) {
      where.name = { contains: filterDto.name, mode: 'insensitive' };
    }

    const [titles, count] = await Promise.all([
      prisma.title.findMany({
        skip: (page - 1) * size,
        take: size,
        where,
        orderBy,
        include: titleInclude,
      }),
      prisma.title.count({
        where,
      }),
    ]);

    return {
      data: titles,
      pagination: {
        page,
        size,
        count,
        totalPages: Math.ceil(count / size),
      },
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

    const title = await prisma.title.findUnique({
      where: { id },
      include: titleInclude,
    });

    if (!title) {
      throw new CustomError(HTTP_EXCEPTIONS.TITLE_NOT_FOUND);
    }

    return title;
  }

  async create(requestedBy: TokenUser, dto: TitleCreateDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    // Check if title with same name already exists
    const existingTitle = await prisma.title.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (existingTitle) {
      throw new CustomError(HTTP_EXCEPTIONS.TITLE_ALREADY_EXISTS);
    }

    const title = await prisma.title.create({
      data: dto,
      include: titleInclude,
    });

    return title;
  }

  async update(requestedBy: TokenUser, dto: TitleUpdateDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const { id, ...updateData } = dto;

    const existingTitle = await prisma.title.findUnique({
      where: { id },
    });

    if (!existingTitle) {
      throw new CustomError(HTTP_EXCEPTIONS.TITLE_NOT_FOUND);
    }

    // Check if title with same name already exists (excluding current title)
    if (updateData.name) {
      const existingTitleWithName = await prisma.title.findFirst({
        where: {
          name: updateData.name,
          id: { not: id },
        },
      });

      if (existingTitleWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.TITLE_ALREADY_EXISTS);
      }
    }

    const title = await prisma.title.update({
      where: { id },
      data: updateData,
      include: titleInclude,
    });

    return title;
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

    const existingTitle = await prisma.title.findUnique({
      where: { id },
    });

    if (!existingTitle) {
      throw new CustomError(HTTP_EXCEPTIONS.TITLE_NOT_FOUND);
    }

    await prisma.title.delete({
      where: { id },
    });

    return { success: true };
  }
}
