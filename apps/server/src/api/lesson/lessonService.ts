import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { lessonInclude } from '@api/libs/prisma/selections';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
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
          { description: { contains: q, mode: 'insensitive' } },
          { curriculum: { name: { contains: q, mode: 'insensitive' } } },
          {
            curriculum: {
              subject: { name: { contains: q, mode: 'insensitive' } },
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
        curriculum: {
          subject: {
            branchId: requestedBy.isSuperAdmin
              ? undefined
              : requestedBy.activeBranchId,
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

    const curriculum = await prisma.curriculum.findUnique({
      where: { id: dto.curriculumId },
    });

    if (!curriculum) {
      throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_NOT_FOUND);
    }

    // Check if lesson with same name already exists in this curriculum
    const existingLesson = await prisma.lesson.findFirst({
      where: {
        curriculumId: dto.curriculumId,
        name: dto.name,
      },
    });

    if (existingLesson) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_ALREADY_EXISTS);
    }

    const lesson = await prisma.lesson.create({
      data: dto,
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

    if (!existingLesson) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_NOT_FOUND);
    }

    // If updating curriculumId, check if curriculum exists
    if (updateData.curriculumId) {
      const newCurriculum = await prisma.curriculum.findUnique({
        where: { id: updateData.curriculumId },
      });

      if (!newCurriculum) {
        throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_NOT_FOUND);
      }
    }

    // Check if lesson with same name already exists in this curriculum (excluding current lesson)
    if (updateData.name || updateData.curriculumId) {
      const curriculumId =
        updateData.curriculumId || existingLesson.curriculumId;
      const name = updateData.name || existingLesson.name;

      const existingLessonWithName = await prisma.lesson.findFirst({
        where: {
          curriculumId,
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
        curriculum: {
          subject: {
            branchId: requestedBy.isSuperAdmin
              ? undefined
              : requestedBy.activeBranchId,
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
