import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { curriculumInclude, subjectInclude } from '@api/libs/prisma/selections';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import {
  CurriculumCreateDto,
  CurriculumFindAllDto,
  CurriculumUpdateDto,
} from '@edusama/common';
import { Service } from 'typedi';
import z from 'zod';

import { PAGE_SIZE } from '../../utils/constants';
import { hasPermission } from '../../utils/hasPermission';

@Service()
export class CurriculumService {
  async findAll(requestedBy: TokenUser, filterDto: CurriculumFindAllDto) {
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
    let orderBy: Prisma.CurriculumOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.CurriculumOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.CurriculumWhereInput = {
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
    };

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

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { subject: { name: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [curriculums, count] = await Promise.all([
      prisma.curriculum.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: curriculumInclude,
      }),
      prisma.curriculum.count({
        where,
      }),
    ]);

    return {
      curriculums,
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

    const curriculum = await prisma.curriculum.findUnique({
      where: {
        id,
        subject: {
          branchId: requestedBy.isSuperAdmin
            ? undefined
            : requestedBy.activeBranchId,
        },
      },
      include: curriculumInclude,
    });

    if (!curriculum) {
      throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_NOT_FOUND);
    }

    return curriculum;
  }

  async create(requestedBy: TokenUser, dto: CurriculumCreateDto) {
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

    // Check if curriculum with same name already exists for this subject
    const existingCurriculum = await prisma.curriculum.findFirst({
      where: {
        subjectId: dto.subjectId,
        name: dto.name,
      },
    });

    if (existingCurriculum) {
      throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_ALREADY_EXISTS);
    }

    const { lessons, subjectId, ...curriculumData } = dto;

    const uuidSchema = z.uuid();

    const isUuid = uuidSchema.safeParse(subjectId).success;

    if (isUuid) {
      const curriculum = await prisma.curriculum.create({
        data: {
          ...curriculumData,
          lessons: { createMany: { data: lessons } },
          subjectId,
        },
        include: curriculumInclude,
      });

      return curriculum;
    } else {
      const subject = await prisma.subject.create({
        data: {
          name: subjectId,
          branchId: requestedBy.activeBranchId,
          curriculums: {
            create: {
              ...curriculumData,
              lessons: {
                createMany: {
                  data: lessons,
                },
              },
            },
          },
        },
        include: subjectInclude,
      });

      const firstCurriculumId = subject.curriculums[0]?.id;

      if (!firstCurriculumId) {
        throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_NOT_FOUND);
      }

      const curriculum = await prisma.curriculum.findUnique({
        where: { id: firstCurriculumId },
        include: curriculumInclude,
      });

      return curriculum;
    }
  }

  async update(requestedBy: TokenUser, dto: CurriculumUpdateDto) {
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

    const { id, lessons, subjectId, ...curriculumData } = dto;

    const existingCurriculum = await prisma.curriculum.findUnique({
      where: {
        id,
        subject: {
          branchId: requestedBy.isSuperAdmin
            ? undefined
            : requestedBy.activeBranchId,
        },
      },
      include: {
        subject: {
          include: { branch: true },
        },
      },
    });

    if (!existingCurriculum) {
      throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_NOT_FOUND);
    }

    const uuidSchema = z.uuid();

    const isSubjectIdUuid = uuidSchema.safeParse(subjectId).success;

    // Check if curriculum with same name already exists for this subject (excluding current curriculum)
    if (curriculumData.name && isSubjectIdUuid) {
      const name = curriculumData.name || existingCurriculum.name;

      const existingCurriculumWithName = await prisma.curriculum.findFirst({
        where: {
          subjectId,
          name,
          id: { not: id },
        },
      });

      if (existingCurriculumWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_ALREADY_EXISTS);
      }
    }

    const curriculum = await prisma.$transaction(
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

        const curriculum = await tx.curriculum.update({
          where: { id },
          data: {
            ...curriculumData,
            ...(isSubjectIdUuid
              ? { subjectId }
              : {
                  subject: {
                    create: {
                      name: subjectId as string,
                      branchId: requestedBy.activeBranchId,
                    },
                  },
                }),
          },
          include: curriculumInclude,
        });

        return curriculum;
      },
      { timeout: 30000 }
    );

    return curriculum;
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

    const existingCurriculum = await prisma.curriculum.findUnique({
      where: {
        id,
        subject: {
          branchId: requestedBy.isSuperAdmin
            ? undefined
            : requestedBy.activeBranchId,
        },
      },
      include: {
        _count: {
          select: {
            integratedClassrooms: true,
          },
        },
      },
    });

    if (!existingCurriculum) {
      throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_NOT_FOUND);
    }

    if (existingCurriculum._count.integratedClassrooms > 0) {
      throw new CustomError(
        HTTP_EXCEPTIONS.CURRICULUM_HAS_INTEGRATED_CLASSROOMS
      );
    }

    await prisma.curriculum.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    return { success: true };
  }
}
