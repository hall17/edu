import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { UnitCreateDto, UnitFindAllDto, UnitUpdateDto } from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';
import { hasPermission } from '../../utils/hasPermission';

@Service()
export class UnitService {
  async findAll(requestedBy: TokenUser, filterDto: UnitFindAllDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.subjects,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 1;
    let orderBy: Prisma.UnitOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.UnitOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.UnitWhereInput = {
      curriculumId: filterDto.curriculumIds?.length
        ? {
            in: filterDto.curriculumIds,
          }
        : undefined,
      curriculum: {
        subjectId: filterDto.subjectIds?.length
          ? {
              in: filterDto.subjectIds,
            }
          : undefined,
        subject: {
          branchId:
            filterDto.global && requestedBy.isSuperAdmin
              ? filterDto.branchIds?.length
                ? {
                    in: filterDto.branchIds,
                  }
                : undefined
              : requestedBy.activeBranchId,
        },
      },
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { curriculum: { name: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [units, count] = await Promise.all([
      prisma.unit.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          curriculum: {
            include: {
              subject: true,
            },
          },
          lessons: true,
        },
      }),
      prisma.unit.count({
        where,
      }),
    ]);

    return {
      units,
      count,
    };
  }

  async findOne(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.subjects,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const unit = await prisma.unit.findUnique({
      where: {
        id,
        curriculum: {
          subject: {
            branchId: requestedBy.isSuperAdmin
              ? undefined
              : requestedBy.activeBranchId,
          },
        },
      },
      include: {
        curriculum: {
          include: {
            subject: true,
          },
        },
        lessons: true,
      },
    });

    if (!unit) {
      throw new CustomError(HTTP_EXCEPTIONS.UNIT_NOT_FOUND);
    }

    return unit;
  }

  async create(requestedBy: TokenUser, dto: UnitCreateDto) {
    // Check if user has permission to write subjects
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.subjects,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Check if unit with same name already exists for this curriculum
    const existingUnit = await prisma.unit.findFirst({
      where: {
        curriculumId: dto.curriculumId,
        name: dto.name,
      },
    });

    if (existingUnit) {
      throw new CustomError(HTTP_EXCEPTIONS.UNIT_ALREADY_EXISTS);
    }

    const { lessons, ...unitData } = dto;

    const unit = await prisma.unit.create({
      data: {
        ...unitData,
        lessons: { createMany: { data: lessons } },
      },
      include: {
        curriculum: {
          include: {
            subject: true,
          },
        },
        lessons: true,
      },
    });

    return unit;
  }

  async update(requestedBy: TokenUser, dto: UnitUpdateDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.subjects,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, lessons, ...unitData } = dto;

    const existingUnit = await prisma.unit.findUnique({
      where: {
        id,
        curriculum: {
          subject: {
            branchId: requestedBy.isSuperAdmin
              ? undefined
              : requestedBy.activeBranchId,
          },
        },
      },
      include: {
        curriculum: {
          include: {
            subject: {
              include: { branch: true },
            },
          },
        },
      },
    });

    if (!existingUnit) {
      throw new CustomError(HTTP_EXCEPTIONS.UNIT_NOT_FOUND);
    }

    // Check if unit with same name already exists for this curriculum (excluding current unit)
    if (unitData.name) {
      const existingUnitWithName = await prisma.unit.findFirst({
        where: {
          curriculumId: dto.curriculumId || existingUnit.curriculumId,
          name: unitData.name,
          id: { not: id },
        },
      });

      if (existingUnitWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.UNIT_ALREADY_EXISTS);
      }
    }

    const unit = await prisma.$transaction(
      async (tx) => {
        if (lessons) {
          await Promise.all(
            lessons.map((lesson) => {
              return tx.lesson.update({
                where: { id: lesson.id },
                data: lesson,
              });
            })
          );
        }

        const unit = await tx.unit.update({
          where: { id },
          data: unitData,
          include: {
            curriculum: {
              include: {
                subject: true,
              },
            },
            lessons: true,
          },
        });

        return unit;
      },
      { timeout: 30000 }
    );

    return unit;
  }

  async delete(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasDeletePermission = hasPermission(
        requestedBy,
        MODULE_CODES.subjects,
        PERMISSIONS.delete
      );

      if (!userHasDeletePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const existingUnit = await prisma.unit.findUnique({
      where: {
        id,
        curriculum: {
          subject: {
            branchId: requestedBy.isSuperAdmin
              ? undefined
              : requestedBy.activeBranchId,
          },
        },
      },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!existingUnit) {
      throw new CustomError(HTTP_EXCEPTIONS.UNIT_NOT_FOUND);
    }

    if (existingUnit._count.lessons > 0) {
      throw new CustomError(HTTP_EXCEPTIONS.UNIT_HAS_LESSONS);
    }

    await prisma.unit.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    return { success: true };
  }
}
