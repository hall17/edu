import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { generateSignedUrl } from '@api/libs/s3';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import {
  LessonMaterialCreateDto,
  LessonMaterialFindAllDto,
  LessonMaterialUpdateDto,
} from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';
import { hasPermission } from '../../utils/hasPermission';

@Service()
export class LessonMaterialService {
  async findAll(requestedBy: TokenUser, filterDto: LessonMaterialFindAllDto) {
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
    let orderBy: Prisma.LessonMaterialOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.LessonMaterialOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.LessonMaterialWhereInput = {
      lessonId: filterDto.lessonIds?.length
        ? {
            in: filterDto.lessonIds,
          }
        : undefined,
      lesson: {
        unit: {
          id: filterDto.unitIds?.length
            ? {
                in: filterDto.unitIds,
              }
            : undefined,
          curriculum: {
            id: filterDto.curriculumIds?.length
              ? {
                  in: filterDto.curriculumIds,
                }
              : undefined,
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
      },
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { lesson: { name: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [lessonMaterials, count] = await Promise.all([
      prisma.lessonMaterial.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          lesson: {
            include: {
              unit: {
                include: {
                  curriculum: {
                    include: {
                      subject: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.lessonMaterial.count({
        where,
      }),
    ]);

    return {
      lessonMaterials,
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

    const lessonMaterial = await prisma.lessonMaterial.findUnique({
      where: {
        id,
        lesson: {
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
      },
      include: {
        lesson: {
          include: {
            unit: {
              include: {
                curriculum: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lessonMaterial) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_MATERIAL_NOT_FOUND);
    }

    return lessonMaterial;
  }

  async create(requestedBy: TokenUser, dto: LessonMaterialCreateDto) {
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

    // Check if lesson material with same name already exists for this lesson
    const existingLessonMaterial = await prisma.lessonMaterial.findFirst({
      where: {
        lessonId: dto.lessonId,
        name: dto.name,
      },
    });

    if (existingLessonMaterial) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_MATERIAL_ALREADY_EXISTS);
    }

    // Verify that the lesson exists and belongs to the user's branch (if not super admin)
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: dto.lessonId,
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
      select: {
        id: true,
        unit: {
          select: {
            id: true,
            curriculum: {
              select: {
                id: true,
                subject: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_NOT_FOUND);
    }

    const id = crypto.randomUUID();
    const ext = dto.url.split('.').pop();
    dto.url = id;
    dto.thumbnailUrl = id + '-thumbnail';

    const lessonMaterial = await prisma.lessonMaterial.create({
      data: { ...dto, extension: ext },
      include: {
        lesson: {
          include: {
            unit: {
              include: {
                curriculum: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const companyId = requestedBy.companyId!;
    const branchId = requestedBy.activeBranchId;
    const subjectId = lesson.unit.curriculum.subject.id;
    const curriculumId = lesson.unit.curriculum.id;
    const unitId = lesson.unit.id;
    const lessonId = lesson.id;

    const path = `${companyId}/${branchId}/materials/${subjectId}/${curriculumId}/${unitId}/${lessonId}/${lessonMaterial.id}`;

    // generate upload urls for url and thumbnailUrl
    const urlSignedAwsS3Url = await generateSignedUrl({
      operation: 'putObject',
      path,
      folder: 'materials',
      key: lessonMaterial.id,
    });

    const thumbnailSignedAwsS3Url = await generateSignedUrl({
      operation: 'putObject',
      path: `${path}-thumbnail`,
      folder: 'materials',
      key: lessonMaterial.id,
    });

    return {
      ...lessonMaterial,
      urlSignedAwsS3Url,
      thumbnailSignedAwsS3Url,
    };
  }

  async update(requestedBy: TokenUser, dto: LessonMaterialUpdateDto) {
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

    const existingLessonMaterial = await prisma.lessonMaterial.findUnique({
      where: {
        id,
        lesson: {
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
      },
      include: {
        lesson: true,
      },
    });

    if (!existingLessonMaterial) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_MATERIAL_NOT_FOUND);
    }

    // Check if lesson material with same name already exists for this lesson (excluding current material)
    if (updateData.name) {
      const existingLessonMaterialWithName =
        await prisma.lessonMaterial.findFirst({
          where: {
            lessonId: dto.lessonId || existingLessonMaterial.lessonId,
            name: updateData.name,
            id: { not: id },
          },
        });

      if (existingLessonMaterialWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.LESSON_MATERIAL_ALREADY_EXISTS);
      }
    }

    // If lessonId is being updated, verify the new lesson exists and belongs to user's branch
    if (dto.lessonId && dto.lessonId !== existingLessonMaterial.lessonId) {
      const newLesson = await prisma.lesson.findUnique({
        where: {
          id: dto.lessonId,
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

      if (!newLesson) {
        throw new CustomError(HTTP_EXCEPTIONS.LESSON_NOT_FOUND);
      }
    }

    let ext = existingLessonMaterial.extension;
    if (updateData.url) {
      updateData.url = crypto.randomUUID();
      ext = updateData.url.split('.').pop() || '';
    }
    if (updateData.thumbnailUrl) {
      updateData.thumbnailUrl = crypto.randomUUID() + '-thumbnail';
    }

    const lessonMaterial = await prisma.lessonMaterial.update({
      where: { id },
      data: { ...updateData, extension: ext },
      include: {
        lesson: {
          include: {
            unit: {
              include: {
                curriculum: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (updateData.url || updateData.thumbnailUrl) {
      const companyId = requestedBy.companyId!;
      const branchId = requestedBy.activeBranchId;
      const subjectId = lessonMaterial.lesson.unit.curriculum.subject.id;
      const curriculumId = lessonMaterial.lesson.unit.curriculum.id;
      const unitId = lessonMaterial.lesson.unit.id;
      const lessonId = lessonMaterial.lesson.id;

      const path = `${companyId}/${branchId}/materials/${subjectId}/${curriculumId}/${unitId}/${lessonId}/${lessonMaterial.id}`;

      let urlSignedAwsS3Url = undefined;
      let thumbnailSignedAwsS3Url = undefined;

      if (updateData.url) {
        urlSignedAwsS3Url = await generateSignedUrl({
          operation: 'putObject',
          path: `${path}-thumbnail`,
          folder: 'materials',
          key: lessonMaterial.id,
        });
      }
      if (updateData.thumbnailUrl) {
        thumbnailSignedAwsS3Url = await generateSignedUrl({
          operation: 'putObject',
          path: `${path}-thumbnail`,
          folder: 'materials',
          key: lessonMaterial.id,
        });
      }

      return {
        ...lessonMaterial,
        urlSignedAwsS3Url,
        thumbnailSignedAwsS3Url,
      };
    }

    return lessonMaterial;
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

    const existingLessonMaterial = await prisma.lessonMaterial.findUnique({
      where: {
        id,
        lesson: {
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
      },
    });

    if (!existingLessonMaterial) {
      throw new CustomError(HTTP_EXCEPTIONS.LESSON_MATERIAL_NOT_FOUND);
    }

    await prisma.lessonMaterial.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    return { success: true };
  }
}
