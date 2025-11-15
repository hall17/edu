import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { lessonInclude } from '@api/libs/prisma/selections';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import {
  LessonUpdateOrderDto,
  MODULE_CODES,
  PERMISSIONS,
} from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';
import { hasPermission } from '../../utils/hasPermission';

import {
  LessonCreateDto,
  LessonFindAllDto,
  LessonUpdateDto,
} from './lessonModel';

@Service()
export class LessonService {
  async findAll(requestedBy: TokenUser, filterDto: LessonFindAllDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.materials,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 1;
    let orderBy: Prisma.LessonOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.LessonOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.LessonWhereInput = {
      unitId: filterDto.unitIds?.length
        ? {
            in: filterDto.unitIds,
          }
        : undefined,
      unit: {
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
      },
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { unit: { name: { contains: q, mode: 'insensitive' } } },
          {
            unit: {
              curriculum: { name: { contains: q, mode: 'insensitive' } },
            },
          },
          {
            unit: {
              curriculum: {
                subject: { name: { contains: q, mode: 'insensitive' } },
              },
            },
          },
        ],
      };
    }

    const [lessons, count] = await Promise.all([
      prisma.lesson.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: lessonInclude,
      }),
      prisma.lesson.count({
        where,
      }),
    ]);

    return {
      lessons,
      count,
    };
  }

  async findOne(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.materials,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id,
        unit: {
          curriculum: {
            subject: {
              branchId: requestedBy.isSuperAdmin
                ? undefined
                : requestedBy.activeBranchId,
            },
          },
        },
      },
      include: lessonInclude,
    });

    if (!lesson) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_NOT_FOUND);
    }

    return lesson;
  }

  async create(requestedBy: TokenUser, dto: LessonCreateDto) {
    // Check if user has permission to write materials
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.materials,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const unit = await prisma.unit.findUnique({
      where: { id: dto.unitId },
      include: {
        lessons: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!unit) {
      throw new CustomError(HTTP_EXCEPTIONS.UNIT_NOT_FOUND);
    }

    // Check if lesson with same name already exists in this curriculum
    const existingLesson = unit.lessons.find(
      (lesson) => lesson.name === dto.name
    );

    if (existingLesson) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_ALREADY_EXISTS);
    }

    const lesson = await prisma.lesson.create({
      data: {
        ...dto,
        order: unit.lessons.length,
      },
      include: lessonInclude,
    });

    return lesson;
  }

  async update(requestedBy: TokenUser, dto: LessonUpdateDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.materials,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, ...updateData } = dto;

    const existingLesson = await prisma.lesson.findUnique({
      where: {
        id,
        unit: {
          curriculum: {
            subject: {
              branchId: requestedBy.isSuperAdmin
                ? undefined
                : requestedBy.activeBranchId,
            },
          },
        },
      },
    });

    if (!existingLesson) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_NOT_FOUND);
    }

    // If updating curriculumId, check if curriculum exists
    if (updateData.unitId) {
      const newUnit = await prisma.unit.findUnique({
        where: { id: updateData.unitId },
      });

      if (!newUnit) {
        throw new CustomError(HTTP_EXCEPTIONS.UNIT_NOT_FOUND);
      }
    }

    // Check if lesson with same name already exists in this curriculum (excluding current lesson)
    if (updateData.name || updateData.unitId) {
      const unitId = updateData.unitId || existingLesson.unitId;
      const name = updateData.name || existingLesson.name;

      const existingLessonWithName = await prisma.lesson.findFirst({
        where: {
          unitId,
          name,
          id: { not: id },
        },
      });

      if (existingLessonWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.LESSON_ALREADY_EXISTS);
      }
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
      include: lessonInclude,
    });

    return lesson;
  }

  async updateOrder(requestedBy: TokenUser, dto: LessonUpdateOrderDto) {
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const lessons = await prisma.lesson.findMany({
      where: { id: { in: dto.lessonIds } },
    });

    if (lessons.length !== dto.lessonIds.length) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_NOT_FOUND);
    }

    await prisma.$transaction(
      async (tx) => {
        for (let index = 0; index < dto.lessonIds.length; index++) {
          const lessonId = dto.lessonIds[index];

          await tx.lesson.update({
            where: { id: lessonId },
            data: { order: index },
          });
        }
      },
      { timeout: 30000 }
    );

    return { success: true };
  }

  async delete(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasDeletePermission = hasPermission(
        requestedBy,
        MODULE_CODES.materials,
        PERMISSIONS.delete
      );

      if (!userHasDeletePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const existingLesson = await prisma.lesson.findUnique({
      where: {
        id,
        unit: {
          curriculum: {
            subject: {
              branchId: requestedBy.isSuperAdmin
                ? undefined
                : requestedBy.activeBranchId,
            },
          },
        },
      },
    });

    if (!existingLesson) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_NOT_FOUND);
    }

    await prisma.lesson.delete({
      where: { id },
    });

    return { success: true };
  }
}
