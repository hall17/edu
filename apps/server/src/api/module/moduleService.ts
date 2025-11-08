import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import {
  deleteS3Object,
  deleteS3ObjectByPath,
  generateSignedUrl,
} from '@api/libs/s3';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';

import {
  ModuleCreateDto,
  ModuleFindAllDto,
  ModuleUpdateDto,
} from './moduleModel';

@Service()
export class ModuleService {
  async findAll(requestedBy: TokenUser, filterDto: ModuleFindAllDto) {
    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 1;
    let orderBy: Prisma.ModuleOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.ModuleOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.ModuleWhereInput = {
      deletedAt: null,
      status: {
        in: filterDto.status || undefined,
      },
      canBeDeleted: filterDto.canBeDeleted,
      isDefault: filterDto.isDefault,
      code: {
        in: filterDto.codes || undefined,
      },
      ...(filterDto.branchId
        ? {
            branches: {
              some: {
                branchId: filterDto.branchId,
              },
            },
          }
        : {}),
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { code: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [modules, count] = await Promise.all([
      prisma.module.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          branches: {
            where: filterDto.branchModules
              ? {
                  branchId: requestedBy.activeBranchId,
                }
              : { branchId: 99999 },
          },
          permissions: true,
        },
      }),
      prisma.module.count({
        where,
      }),
    ]);

    return {
      modules,
      pagination: {
        page,
        size: filterDto.all ? count : size,
        count,
        totalPages: Math.ceil(count / (filterDto.all ? count : size)),
      },
    };
  }

  async findOne(requestedBy: TokenUser, id: number) {
    const module = await prisma.module.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!module) {
      throw new CustomError(HTTP_EXCEPTIONS.MODULE_NOT_FOUND);
    }

    return module;
  }

  async create(requestedBy: TokenUser, dto: ModuleCreateDto) {
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const maybeModule = await prisma.module.findFirst({
      where: {
        OR: [{ code: dto.code }, { name: dto.name }],
        deletedAt: null,
      },
    });

    if (maybeModule) {
      throw new CustomError(HTTP_EXCEPTIONS.MODULE_ALREADY_EXISTS);
    }

    const module = await prisma.module.create({
      data: dto,
    });

    return module;
  }

  async update(requestedBy: TokenUser, dto: ModuleUpdateDto) {
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const { id, ...updateData } = dto;

    const existingModule = await prisma.module.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingModule) {
      throw new CustomError(HTTP_EXCEPTIONS.MODULE_NOT_FOUND);
    }

    if (updateData.code) {
      const existingModuleByCode = await prisma.module.findFirst({
        where: {
          code: updateData.code,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingModuleByCode) {
        throw new CustomError(HTTP_EXCEPTIONS.MODULE_ALREADY_EXISTS);
      }
    }

    if (updateData.name) {
      const existingModuleByName = await prisma.module.findFirst({
        where: {
          name: updateData.name,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingModuleByName) {
        throw new CustomError(HTTP_EXCEPTIONS.MODULE_ALREADY_EXISTS);
      }
    }

    if (updateData.videoUrl) {
      updateData.videoUrl = id.toString();
    } else if (updateData.videoUrl === null) {
      // delete video from s3
      await deleteS3ObjectByPath(`modules/${id.toString()}-video`);
    }

    if (updateData.videoThumbnailUrl) {
      updateData.videoThumbnailUrl = id.toString();
    } else if (updateData.videoThumbnailUrl === null) {
      // delete video thumbnail from s3
      await deleteS3ObjectByPath(`modules/${id.toString()}-video-thumbnail`);
    }

    const module = await prisma.module.update({
      where: { id },
      data: updateData,
    });

    if (module.videoUrl) {
      module.videoUrl = await generateSignedUrl({
        operation: 'getObject',
        path: `modules/${id.toString()}-video`,
      });
    }
    if (module.videoThumbnailUrl) {
      module.videoThumbnailUrl = await generateSignedUrl({
        operation: 'getObject',
        path: `modules/${id.toString()}-video-thumbnail`,
      });
    }

    return module;
  }

  async delete(requestedBy: TokenUser, id: number) {
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const existingModule = await prisma.module.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        branches: true,
        classrooms: true,
        classroomTemplates: true,
        requiredModules: true,
        requiredByModules: true,
      },
    });

    if (!existingModule) {
      throw new CustomError(HTTP_EXCEPTIONS.MODULE_NOT_FOUND);
    }

    if (!existingModule.canBeDeleted) {
      throw new CustomError(HTTP_EXCEPTIONS.MODULE_CANNOT_BE_DELETED);
    }

    const hasAssociatedData =
      existingModule.branches.length > 0 ||
      existingModule.classrooms.length > 0 ||
      existingModule.classroomTemplates.length > 0 ||
      existingModule.requiredModules.length > 0 ||
      existingModule.requiredByModules.length > 0;

    if (hasAssociatedData) {
      throw new CustomError(HTTP_EXCEPTIONS.MODULE_HAS_ASSOCIATED_DATA);
    }

    await prisma.module.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    return { success: true };
  }
}
