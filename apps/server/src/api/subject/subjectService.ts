import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { subjectInclude } from '@api/libs/prisma/selections';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';
import { hasPermission } from '../../utils/hasPermission';

import {
  SubjectCreateDto,
  SubjectFindAllDto,
  SubjectUpdateDto,
} from './subjectModel';

@Service()
export class SubjectService {
  async findAll(requestedBy: TokenUser, filterDto: SubjectFindAllDto) {
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
    let orderBy: Prisma.SubjectOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order as Prisma.SortOrder };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.SubjectWhereInput = {
      status: {
        in: filterDto.status || undefined,
      },
      branchId:
        filterDto.global && requestedBy.isSuperAdmin
          ? filterDto.branchIds?.length
            ? {
                in: filterDto.branchIds,
              }
            : undefined
          : requestedBy.activeBranchId,
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
        OR: [{ name: { contains: q, mode: 'insensitive' } }],
      };
    }

    const [subjects, count] = await Promise.all([
      prisma.subject.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: subjectInclude,
      }),
      prisma.subject.count({
        where,
      }),
    ]);

    return {
      subjects,
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

    const subject = await prisma.subject.findUnique({
      where: {
        id,
        branchId: requestedBy.isSuperAdmin
          ? undefined
          : requestedBy.activeBranchId,
      },
      include: subjectInclude,
    });

    if (!subject) {
      throw new CustomError(HTTP_EXCEPTIONS.SUBJECT_NOT_FOUND);
    }

    return subject;
  }

  async create(requestedBy: TokenUser, dto: SubjectCreateDto) {
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

    // Check if subject with same name already exists in the branch
    const existingSubject = await prisma.subject.findFirst({
      where: {
        branchId: requestedBy.activeBranchId,
        name: dto.name,
        deletedAt: null,
      },
    });

    if (existingSubject) {
      throw new CustomError(HTTP_EXCEPTIONS.SUBJECT_ALREADY_EXISTS);
    }

    const { curriculums, ...subjectData } = dto;
    const subject = await prisma.subject.create({
      data: {
        ...subjectData,
        branchId: requestedBy.activeBranchId,
        curriculums: {
          createMany: {
            data: curriculums.map((curriculum) => {
              return {
                name: curriculum.name,
                description: curriculum.description,
                lessons: {
                  createMany: {
                    data: curriculum.lessons.map((lesson) => ({
                      name: lesson.name,
                      description: lesson.description,
                    })),
                  },
                },
              };
            }),
          },
        },
      },
      include: subjectInclude,
    });

    return subject;
  }

  async update(requestedBy: TokenUser, dto: SubjectUpdateDto) {
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

    const { id, ...updateData } = dto;

    const existingSubject = await prisma.subject.findUnique({
      where: {
        id,
        branchId: requestedBy.isSuperAdmin
          ? undefined
          : requestedBy.activeBranchId,
        deletedAt: null,
      },
    });

    if (!existingSubject) {
      throw new CustomError(HTTP_EXCEPTIONS.SUBJECT_NOT_FOUND);
    }

    // Check if subject with same name already exists in the branch (excluding current subject)
    if (updateData.name) {
      const existingSubjectWithName = await prisma.subject.findFirst({
        where: {
          branchId: existingSubject.branchId,
          name: updateData.name,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingSubjectWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.SUBJECT_ALREADY_EXISTS);
      }
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: updateData,
      include: subjectInclude,
    });

    return subject;
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

    const existingSubject = await prisma.subject.findUnique({
      where: {
        id,
        branchId: requestedBy.isSuperAdmin
          ? undefined
          : requestedBy.activeBranchId,
      },
      include: {
        _count: {
          select: {
            integratedClassrooms: true,
          },
        },
      },
    });

    if (!existingSubject) {
      throw new CustomError(HTTP_EXCEPTIONS.SUBJECT_NOT_FOUND);
    }

    if (existingSubject._count.integratedClassrooms > 0) {
      throw new CustomError(HTTP_EXCEPTIONS.SUBJECT_HAS_ASSOCIATED_DATA);
    }

    await prisma.subject.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    return { success: true };
  }
}
