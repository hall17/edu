import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { branchInclude } from '@api/libs/prisma/selections';
import { generateSignedUrl } from '@api/libs/s3';
import { Branch, Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { hasPermission } from '@api/utils';
import {
  BranchUpdateMyBranchDto,
  MODULE_CODES,
  PERMISSIONS,
} from '@edusama/common';
import {
  BranchCreateDto,
  BranchFindAllDto,
  BranchUpdateDto,
  BranchUpdateStatusDto,
  ModuleUpdateStatusDto,
} from '@edusama/common';
import dayjs from 'dayjs';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';

@Service()
export class BranchService {
  async findAll(requestedBy: TokenUser, filterDto: BranchFindAllDto) {
    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 1;
    let orderBy: Prisma.BranchOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.BranchOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.BranchWhereInput = {
      status: {
        in: filterDto.status || undefined,
      },
      companyId: filterDto.companyIds?.length
        ? {
            in: filterDto.companyIds,
          }
        : undefined,
    };

    // Apply branch access control
    if (!requestedBy.isSuperAdmin) {
      where = {
        ...where,
        id: {
          in: requestedBy.branchIds,
        },
      };
    }

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { slug: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
          { contact: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [branches, count] = await Promise.all([
      prisma.branch.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: branchInclude,
      }),
      prisma.branch.count({
        where,
      }),
    ]);

    const branchesWithData = await Promise.all(
      branches.map((branch) => this.createBranchData(requestedBy, branch))
    );

    return {
      branches: branchesWithData,
      pagination: {
        page,
        size,
        count,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async findOne(requestedBy: TokenUser, id: number) {
    // Apply branch access control first
    if (!requestedBy.isSuperAdmin && !requestedBy.branchIds.includes(id)) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.branches,
      PERMISSIONS.read
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const branch = await prisma.branch.findUnique({
      where: { id },
      include: branchInclude,
    });

    if (!branch) {
      throw new CustomError(HTTP_EXCEPTIONS.BRANCH_NOT_FOUND);
    }

    return this.createBranchData(requestedBy, branch);
  }

  async create(requestedBy: TokenUser, dto: BranchCreateDto) {
    // Only super admins can create branches
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: dto.companyId },
    });

    if (!company) {
      throw new CustomError(HTTP_EXCEPTIONS.COMPANY_NOT_FOUND);
    }

    // Check if branch with same name already exists in the company
    const existingBranch = await prisma.branch.findFirst({
      where: {
        companyId: dto.companyId,
        name: dto.name,
      },
    });

    if (existingBranch) {
      throw new CustomError(HTTP_EXCEPTIONS.BRANCH_ALREADY_EXISTS);
    }

    if (dto.logoUrl) {
      const extension = dto.logoUrl.split('.').pop();
      dto.logoUrl = `logo.${extension}`;
    }

    const branch = await prisma.branch.create({
      data: dto,
      include: branchInclude,
    });

    if (dto.logoUrl) {
      const signedAwsS3Url = await generateSignedUrl(
        'putObject',
        requestedBy.companyId!,
        requestedBy.activeBranchId,
        undefined,
        dto.logoUrl
      );

      return {
        ...branch,
        signedAwsS3Url,
      };
    }

    return branch;
  }

  async update(requestedBy: TokenUser, dto: BranchUpdateDto) {
    const { id, ...updateData } = dto;

    // Check if user has access to this branch first
    if (!requestedBy.isSuperAdmin && !requestedBy.branchIds.includes(id)) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const existingBranch = await prisma.branch.findUnique({
      where: { id },
    });

    if (!existingBranch) {
      throw new CustomError(HTTP_EXCEPTIONS.BRANCH_NOT_FOUND);
    }

    // If updating companyId, check if company exists
    if (updateData.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: updateData.companyId },
      });

      if (!company) {
        throw new CustomError(HTTP_EXCEPTIONS.COMPANY_NOT_FOUND);
      }
    }

    // Check if branch with same name already exists in the company (excluding current branch)
    if (updateData.name) {
      const companyId = updateData.companyId || existingBranch.companyId;
      const existingBranchWithName = await prisma.branch.findFirst({
        where: {
          companyId,
          name: updateData.name,
          id: { not: id },
        },
      });

      if (existingBranchWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.BRANCH_ALREADY_EXISTS);
      }
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: updateData,
      include: branchInclude,
    });

    if (updateData.logoUrl) {
      const signedAwsS3Url = await generateSignedUrl(
        'putObject',
        requestedBy.companyId!,
        requestedBy.activeBranchId,
        undefined,
        updateData.logoUrl
      );

      return {
        ...branch,
        signedAwsS3Url,
      };
    }

    return this.createBranchData(requestedBy, branch);
  }

  async updateMyBranch(requestedBy: TokenUser, dto: BranchUpdateMyBranchDto) {
    return this.update(requestedBy, dto);
  }

  async updateStatus(requestedBy: TokenUser, dto: BranchUpdateStatusDto) {
    return this.update(requestedBy, dto);
  }

  async delete(requestedBy: TokenUser, id: number) {
    // Check if user has access to this branch first
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const existingBranch = await prisma.branch.findUnique({
      where: { id },
    });

    if (!existingBranch) {
      throw new CustomError(HTTP_EXCEPTIONS.BRANCH_NOT_FOUND);
    }

    if (existingBranch.slug === 'edusama') {
      throw new CustomError(HTTP_EXCEPTIONS.CANNOT_DELETE_EDUSAMA);
    }

    // Check if branch can be deleted
    if (!existingBranch.canBeDeleted) {
      throw new CustomError(HTTP_EXCEPTIONS.CANNOT_DELETE_BRANCH);
    }

    await prisma.branch.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    return { success: true };
  }

  async addModule(requestedBy: TokenUser, moduleId: number) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.modules,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const nextYearToday = dayjs().add(1, 'year').toDate();

    const moduleOnBranch = await prisma.branchModule.create({
      data: {
        moduleId,
        branchId: requestedBy.activeBranchId,
        expiresAt: nextYearToday,
        createdBy: requestedBy.id,
      },
    });

    return moduleOnBranch;
  }

  async updateModuleStatus(requestedBy: TokenUser, dto: ModuleUpdateStatusDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.modules,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const moduleOnBranch = await prisma.branchModule.update({
      where: {
        moduleId: dto.moduleId,
        branchId: requestedBy.activeBranchId,
        branchId_moduleId: {
          branchId: requestedBy.activeBranchId,
          moduleId: dto.moduleId,
        },
      },
      data: { status: dto.status },
    });

    return moduleOnBranch;
  }

  async deleteModule(requestedBy: TokenUser, moduleId: number) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.modules,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    await prisma.branchModule.delete({
      where: {
        moduleId,
        branchId: requestedBy.activeBranchId,
        branchId_moduleId: {
          branchId: requestedBy.activeBranchId,
          moduleId,
        },
      },
    });

    return { success: true };
  }

  private async createBranchData<T extends Branch>(
    requestedBy: TokenUser,
    branch: T
  ) {
    if (branch.logoUrl) {
      const url = await generateSignedUrl(
        'getObject',
        requestedBy.companyId!,
        requestedBy.activeBranchId,
        undefined,
        branch.logoUrl
      );
      branch.logoUrl = url;
    }

    return branch;
  }
}
