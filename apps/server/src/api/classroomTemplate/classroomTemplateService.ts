import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { classroomTemplateInclude } from '@api/libs/prisma/selections';
import { generateSignedUrl } from '@api/libs/s3';
import { Prisma, ClassroomTemplate } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import {
  ClassroomTemplateCreateDto,
  ClassroomTemplateFindAllDto,
  ClassroomTemplateUpdateDto,
} from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';
import { hasPermission } from '../../utils/hasPermission';

type ClassroomTemplateData = Prisma.ClassroomTemplateGetPayload<{
  include: typeof classroomTemplateInclude;
}>;

@Service()
export class ClassroomTemplateService {
  async findAll(
    requestedBy: TokenUser,
    filterDto: ClassroomTemplateFindAllDto
  ) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.classrooms,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 1;
    let orderBy: Prisma.ClassroomTemplateOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.ClassroomTemplateOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.ClassroomTemplateWhereInput = {
      branchId:
        filterDto.global && requestedBy.isSuperAdmin
          ? filterDto.branchIds?.length
            ? {
                in: filterDto.branchIds,
              }
            : undefined
          : requestedBy.activeBranchId,
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [classroomTemplates, count] = await Promise.all([
      prisma.classroomTemplate.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: classroomTemplateInclude,
      }),
      prisma.classroomTemplate.count({
        where,
      }),
    ]);

    const classroomTemplatesWithData = await Promise.all(
      classroomTemplates.map((classroomTemplate) =>
        this.createClassroomTemplateData(requestedBy, classroomTemplate)
      )
    );

    return {
      classroomTemplates: classroomTemplatesWithData,
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
        MODULE_CODES.classrooms,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const classroomTemplate = await prisma.classroomTemplate.findUnique({
      where: {
        id,
        branchId: requestedBy.isSuperAdmin
          ? undefined
          : requestedBy.activeBranchId,
      },
      include: classroomTemplateInclude,
    });

    if (!classroomTemplate) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_TEMPLATE_NOT_FOUND);
    }

    return this.createClassroomTemplateData(requestedBy, classroomTemplate);
  }

  async create(requestedBy: TokenUser, dto: ClassroomTemplateCreateDto) {
    const { moduleIds, schedules: _, ...templateData } = dto;

    // Check if user has permission to write classrooms
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.classrooms,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Check if classroom template with same name already exists in the branch
    const existingClassroomTemplate = await prisma.classroomTemplate.findFirst({
      where: {
        branchId: requestedBy.activeBranchId,
        name: dto.name,
      },
    });

    if (existingClassroomTemplate) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_TEMPLATE_ALREADY_EXISTS);
    }

    // Validate modules exist and belong to the branch
    if (moduleIds && moduleIds.length > 0) {
      const modules = await prisma.module.findMany({
        where: {
          id: { in: moduleIds },
        },
        include: {
          branches: {
            where: { branchId: requestedBy.activeBranchId },
          },
        },
      });

      if (modules.length !== moduleIds.length) {
        throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
      }

      // Check if all modules are available in this branch
      const unavailableModules = modules.filter(
        (module) => module.branches.length === 0
      );
      if (unavailableModules.length > 0) {
        throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
      }
    }

    // Create classroom template with modules and schedules in a transaction
    const classroomTemplate = await prisma.$transaction(async (tx) => {
      // Create the classroom template
      const template = await tx.classroomTemplate.create({
        data: { ...templateData, branchId: requestedBy.activeBranchId },
        include: classroomTemplateInclude,
      });

      // Add modules if provided
      if (moduleIds && moduleIds.length > 0) {
        await tx.classroomTemplateModule.createMany({
          data: moduleIds.map((moduleId) => ({
            classroomTemplateId: template.id,
            moduleId,
          })),
        });
      }

      // Return the complete template with includes
      return tx.classroomTemplate.findUnique({
        where: { id: template.id },
        include: classroomTemplateInclude,
      });
    });

    return this.createClassroomTemplateData(requestedBy, classroomTemplate!);
  }

  async update(requestedBy: TokenUser, dto: ClassroomTemplateUpdateDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.classrooms,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, moduleIds, schedules: _, ...updateData } = dto;

    const existingClassroomTemplate = await prisma.classroomTemplate.findUnique(
      {
        where: {
          id,
          branchId: requestedBy.isSuperAdmin
            ? undefined
            : requestedBy.activeBranchId,
        },
        include: classroomTemplateInclude,
      }
    );

    if (!existingClassroomTemplate) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_TEMPLATE_NOT_FOUND);
    }

    // Check if classroom template with same name already exists in the branch (excluding current template)
    if (updateData.name) {
      const existingClassroomTemplateWithName =
        await prisma.classroomTemplate.findFirst({
          where: {
            branchId: requestedBy.activeBranchId,
            name: updateData.name,
            id: { not: id },
          },
        });

      if (existingClassroomTemplateWithName) {
        throw new CustomError(
          HTTP_EXCEPTIONS.CLASSROOM_TEMPLATE_ALREADY_EXISTS
        );
      }
    }

    // Validate modules exist and belong to the branch
    if (moduleIds && moduleIds.length > 0) {
      const modules = await prisma.module.findMany({
        where: {
          id: { in: moduleIds },
        },
        include: {
          branches: {
            where: { branchId: requestedBy.activeBranchId },
          },
        },
      });

      if (modules.length !== moduleIds.length) {
        throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
      }

      // Check if all modules are available in this branch
      const unavailableModules = modules.filter(
        (module) => module.branches.length === 0
      );
      if (unavailableModules.length > 0) {
        throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
      }
    }

    // Update classroom template with modules and schedules in a transaction
    const classroomTemplate = await prisma.$transaction(
      async (tx) => {
        // Update the classroom template
        await tx.classroomTemplate.update({
          where: { id },
          data: { ...updateData, branchId: requestedBy.activeBranchId },
          include: classroomTemplateInclude,
        });

        // Update modules if provided
        if (moduleIds !== undefined) {
          const addedModuleIds = moduleIds.filter(
            (moduleId) =>
              !existingClassroomTemplate.modules.some(
                (module) => module.module.id === moduleId
              )
          );
          const deletedModuleIds = existingClassroomTemplate.modules.filter(
            (module) => !moduleIds.includes(module.module.id)
          );

          if (deletedModuleIds.length > 0) {
            // Delete existing modules
            await tx.classroomTemplateModule.deleteMany({
              where: {
                classroomTemplateId: id,
                moduleId: {
                  in: deletedModuleIds.map((module) => module.module.id),
                },
              },
            });
          }

          if (addedModuleIds.length > 0) {
            await tx.classroomTemplateModule.createMany({
              data: addedModuleIds.map((moduleId) => ({
                classroomTemplateId: id,
                moduleId,
              })),
            });
          }
        }

        // Return the complete template with includes
        return tx.classroomTemplate.findUnique({
          where: { id },
          include: classroomTemplateInclude,
        });
      },
      { timeout: 30000 }
    );

    return this.createClassroomTemplateData(requestedBy, classroomTemplate!);
  }

  async delete(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasDeletePermission = hasPermission(
        requestedBy,
        MODULE_CODES.classrooms,
        PERMISSIONS.delete
      );

      if (!userHasDeletePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const existingClassroomTemplate = await prisma.classroomTemplate.findUnique(
      {
        where: {
          id,
          branchId: requestedBy.isSuperAdmin
            ? undefined
            : requestedBy.activeBranchId,
        },
      }
    );

    if (!existingClassroomTemplate) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_TEMPLATE_NOT_FOUND);
    }

    await prisma.classroomTemplate.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    return { success: true };
  }

  private async createClassroomTemplateData(
    requestedBy: TokenUser,
    classroomTemplate: ClassroomTemplate
  ) {
    if (classroomTemplate.imageUrl) {
      const url = await generateSignedUrl({
        operation: 'getObject',
        companyId: requestedBy.companyId!,
        branchId: requestedBy.activeBranchId,
        folder: 'classroom-templates',
        key: classroomTemplate.imageUrl,
      });

      classroomTemplate.imageUrl = url;
    }

    return classroomTemplate as ClassroomTemplateData;
  }
}
