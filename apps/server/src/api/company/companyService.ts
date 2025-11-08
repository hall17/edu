import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { companyInclude } from '@api/libs/prisma/selections';
import { generateSignedUrl } from '@api/libs/s3';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import {
  CompanyCreateDto,
  CompanyFindAllDto,
  CompanyUpdateStatusDto,
  CompanyUpdateDto,
} from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';

@Service()
export class CompanyService {
  async findAll(requestedBy: TokenUser, filterDto: CompanyFindAllDto) {
    // Only super admins can view all companies
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 0;
    let orderBy: Prisma.CompanyOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.CompanyOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.CompanyWhereInput = {
      status: {
        in: filterDto.status || undefined,
      },
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { slug: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [companies, count] = await Promise.all([
      prisma.company.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: companyInclude,
      }),
      prisma.company.count({
        where,
      }),
    ]);

    return {
      companies,
      pagination: {
        page,
        size,
        count,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async findOne(requestedBy: TokenUser, id: number) {
    // Only super admins can view companies
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const company = await prisma.company.findUnique({
      where: { id },
      include: companyInclude,
    });

    if (!company) {
      throw new CustomError(HTTP_EXCEPTIONS.COMPANY_NOT_FOUND);
    }

    return company;
  }

  async create(requestedBy: TokenUser, dto: CompanyCreateDto) {
    // Only super admins can create companies
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    if (dto.logoUrl) {
      const extension = dto.logoUrl.split('.').pop();
      dto.logoUrl = `logo.${extension}`;
    }

    // Check if company with same name already exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (existingCompany) {
      throw new CustomError(HTTP_EXCEPTIONS.COMPANY_ALREADY_EXISTS);
    }

    const company = await prisma.company.create({
      data: dto,
      include: companyInclude,
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
        ...company,
        signedAwsS3Url,
      };
    }

    return company;
  }

  async update(requestedBy: TokenUser, dto: CompanyUpdateDto) {
    // Only super admins can update companies
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const { id, ...updateData } = dto;

    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      throw new CustomError(HTTP_EXCEPTIONS.COMPANY_NOT_FOUND);
    }

    // Check if company with same name already exists (excluding current company)
    if (updateData.name) {
      const existingCompanyWithName = await prisma.company.findFirst({
        where: {
          name: updateData.name,
          id: { not: id },
        },
      });

      if (existingCompanyWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.COMPANY_ALREADY_EXISTS);
      }
    }

    if (updateData.logoUrl) {
      const extension = updateData.logoUrl.split('.').pop();
      updateData.logoUrl = `logo.${extension}`;
    }

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
      include: companyInclude,
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
        ...company,
        signedAwsS3Url,
      };
    }

    return company;
  }

  async updateStatus(requestedBy: TokenUser, dto: CompanyUpdateStatusDto) {
    // Only super admins can suspend companies
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const existingCompany = await prisma.company.findUnique({
      where: { id: dto.id },
    });

    if (!existingCompany) {
      throw new CustomError(HTTP_EXCEPTIONS.COMPANY_NOT_FOUND);
    }

    const now = new Date();

    if (dto.status === 'SUSPENDED') {
      await prisma.company.update({
        where: { id: dto.id },
        data: {
          status: 'SUSPENDED',
          statusUpdatedAt: now,
          statusUpdatedBy: requestedBy.id,
          statusUpdateReason: dto.statusUpdateReason,
          branches: {
            updateMany: {
              where: {
                deletedAt: null,
              },
              data: {
                status: 'SUSPENDED',
                statusUpdatedAt: now,
                statusUpdatedBy: requestedBy.id,
                statusUpdateReason: dto.statusUpdateReason,
              },
            },
          },
        },
      });
    } else {
      await prisma.company.update({
        where: { id: dto.id },
        data: {
          status: 'ACTIVE',
        },
      });
    }

    return { success: true };
  }

  async delete(requestedBy: TokenUser, id: number) {
    // Only super admins can delete companies
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const existingCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        branches: true,
      },
    });

    if (!existingCompany) {
      throw new CustomError(HTTP_EXCEPTIONS.COMPANY_NOT_FOUND);
    }

    if (existingCompany.slug === 'edusama') {
      throw new CustomError(HTTP_EXCEPTIONS.CANNOT_DELETE_EDUSAMA);
    }

    await prisma.company.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
        branches: {
          deleteMany: {
            deletedAt: new Date(),
            deletedBy: requestedBy.id,
          },
        },
      },
    });

    return { success: true };
  }
}
