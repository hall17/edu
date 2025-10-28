import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { roleInclude } from '@api/libs/prisma/selections';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { hasPermission } from '@api/utils/hasPermission';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';

import { RoleCreateDto, RoleFindAllDto, RoleUpdateDto } from './roleModel';

@Service()
export class RoleService {
  async findAll(requestedBy: TokenUser, filterDto: RoleFindAllDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.usersAndRoles,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 0;
    let orderBy: Prisma.RoleOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order as Prisma.SortOrder };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.RoleWhereInput = {
      OR: [
        { branchId: requestedBy.activeBranchId },
        {
          isSystem: true,
        },
      ],
      status: {
        in: filterDto.status || undefined,
      },
      isVisible: filterDto.isVisible,
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { code: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [roles, count] = await Promise.all([
      prisma.role.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: roleInclude,
      }),
      prisma.role.count({
        where,
      }),
    ]);

    return {
      roles,
      count,
    };
  }

  async findOne(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.usersAndRoles,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const role = await prisma.role.findUnique({
      where: { id, branchId: requestedBy.activeBranchId },
      include: roleInclude,
    });

    if (!role) {
      throw new CustomError(HTTP_EXCEPTIONS.ROLE_NOT_FOUND);
    }

    // Check if user has access to this role's branch
    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.branchIds.includes(role.branchId)
    ) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    return role;
  }

  async create(requestedBy: TokenUser, dto: RoleCreateDto) {
    // Check if user has access to the specified branch
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const branchId =
      requestedBy.isSuperAdmin && dto.branchId
        ? dto.branchId
        : requestedBy.activeBranchId;

    // Check if role with same name already exists in the branch
    const existingRole = await prisma.role.findFirst({
      where: {
        branchId,
        name: dto.name,
      },
    });

    if (existingRole) {
      throw new CustomError(HTTP_EXCEPTIONS.ROLE_ALREADY_EXISTS);
    }

    const { permissionIds, ...rest } = dto;

    const role = await prisma.role.create({
      data: {
        ...rest,
        isSystem: requestedBy.isSuperAdmin ? dto.isSystem : false, // User-created roles are never system roles
        isVisible: requestedBy.isSuperAdmin ? dto.isVisible : true,
        branchId,
        permissions: permissionIds
          ? {
              createMany: {
                data: permissionIds.map((permissionId) => ({
                  permissionId,
                })),
              },
            }
          : undefined,
      },
      include: roleInclude,
    });

    return role;
  }

  async update(requestedBy: TokenUser, dto: RoleUpdateDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const existingRole = await prisma.role.findUnique({
      where: {
        id: dto.id,
        branchId:
          requestedBy.isSuperAdmin && dto.branchId
            ? dto.branchId
            : requestedBy.activeBranchId,
      },
      include: roleInclude,
    });

    if (!existingRole) {
      throw new CustomError(HTTP_EXCEPTIONS.ROLE_NOT_FOUND);
    }

    // Prevent updating system roles
    if (existingRole.isSystem && !requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.CANNOT_UPDATE_SYSTEM_ROLE);
    }

    // Check if role with same name already exists in the branch (excluding current role)
    if (dto.name) {
      const branchId = dto.branchId || existingRole.branchId;
      const existingRoleWithName = await prisma.role.findFirst({
        where: {
          branchId,
          name: dto.name,
          id: { not: dto.id },
        },
      });

      if (existingRoleWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.ROLE_ALREADY_EXISTS);
      }
    }

    const { permissionIds, ...rest } = dto;

    const addedPermissionIds = permissionIds
      ? permissionIds.filter(
          (permissionId) =>
            !existingRole.permissions.some(
              (permission) => permission.permissionId === permissionId
            )
        )
      : [];
    const deletedPermissionIds = permissionIds
      ? existingRole.permissions.filter(
          (permission) => !permissionIds.includes(permission.permissionId)
        )
      : [];

    const role = await prisma.role.update({
      where: { id: dto.id },
      data: {
        ...rest,
        permissions: {
          createMany: {
            data: addedPermissionIds.map((permissionId) => ({
              permissionId,
            })),
          },
          deleteMany: {
            permissionId: {
              in: deletedPermissionIds.map(
                (permission) => permission.permissionId
              ),
            },
          },
        },
      },
      include: roleInclude,
    });

    return role;
  }

  async delete(requestedBy: TokenUser, id: string) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.usersAndRoles,
      PERMISSIONS.delete
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const role = await prisma.role.findUnique({
      where: {
        id,
        branchId: requestedBy.activeBranchId,
        isSystem: false,
      },
    });

    if (!role) {
      throw new CustomError(HTTP_EXCEPTIONS.ROLE_NOT_FOUND);
    }

    // Prevent deleting system roles
    if (role.isSystem && !requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.CANNOT_DELETE_SYSTEM_ROLE);
    }

    await prisma.role.delete({
      where: { id },
    });

    return { success: true };
  }
}
