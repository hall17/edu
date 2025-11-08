import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';

import {
  PermissionCreateDto,
  PermissionFindAllDto,
  PermissionUpdateDto,
  AssignPermissionsToRoleDto,
  RemovePermissionsFromRoleDto,
} from './permissionModel';

@Service()
export class PermissionService {
  async findAll(requestedBy: TokenUser, filterDto: PermissionFindAllDto) {
    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 1;
    let orderBy: Prisma.PermissionOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.PermissionOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.PermissionWhereInput = {};

    if (filterDto.moduleId) {
      where.moduleId = filterDto.moduleId;
    }

    if (filterDto.name) {
      where.name = { contains: filterDto.name, mode: 'insensitive' };
    }

    if (q) {
      where = {
        ...where,
        OR: [{ name: { contains: q, mode: 'insensitive' } }],
      };
    }

    const [permissions, count] = await Promise.all([
      prisma.permission.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          module: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          roles: {
            include: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.permission.count({
        where,
      }),
    ]);

    return {
      permissions,
      pagination: {
        page,
        size,
        count,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async findOne(requestedBy: TokenUser, id: string) {
    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!permission) {
      throw new CustomError(HTTP_EXCEPTIONS.PERMISSION_NOT_FOUND);
    }

    return permission;
  }

  async create(requestedBy: TokenUser, dto: PermissionCreateDto) {
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const existingPermission = await prisma.permission.findFirst({
      where: {
        name: dto.name,
        moduleId: dto.moduleId,
      },
    });

    if (existingPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.PERMISSION_ALREADY_EXISTS);
    }

    const permission = await prisma.permission.create({
      data: dto,
      include: {
        module: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return permission;
  }

  async update(requestedBy: TokenUser, dto: PermissionUpdateDto) {
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const { id, ...updateData } = dto;

    const existingPermission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.PERMISSION_NOT_FOUND);
    }

    if (updateData.name && updateData.moduleId) {
      const existingPermissionWithName = await prisma.permission.findFirst({
        where: {
          name: updateData.name,
          moduleId: updateData.moduleId,
          id: { not: id },
        },
      });

      if (existingPermissionWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.PERMISSION_ALREADY_EXISTS);
      }
    }

    const permission = await prisma.permission.update({
      where: { id },
      data: updateData,
      include: {
        module: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return permission;
  }

  async delete(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const existingPermission = await prisma.permission.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });

    if (!existingPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.PERMISSION_NOT_FOUND);
    }

    if (existingPermission.roles.length > 0) {
      throw new CustomError(HTTP_EXCEPTIONS.PERMISSION_HAS_ROLES);
    }

    await prisma.permission.delete({
      where: { id },
    });

    return { success: true };
  }

  async assignPermissionsToRole(
    requestedBy: TokenUser,
    dto: AssignPermissionsToRoleDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const { roleId, permissionIds } = dto;

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new CustomError(HTTP_EXCEPTIONS.ROLE_NOT_FOUND);
    }

    const permissions = await prisma.permission.findMany({
      where: {
        id: { in: permissionIds },
      },
    });

    if (permissions.length !== permissionIds.length) {
      throw new CustomError(HTTP_EXCEPTIONS.PERMISSION_NOT_FOUND);
    }

    const existingAssignments = await prisma.rolePermission.findMany({
      where: {
        roleId,
        permissionId: { in: permissionIds },
      },
    });

    const newPermissionIds = permissionIds.filter(
      (permissionId) =>
        !existingAssignments.some(
          (assignment) => assignment.permissionId === permissionId
        )
    );

    if (newPermissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: newPermissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      });
    }

    return { success: true, assignedCount: newPermissionIds.length };
  }

  async removePermissionsFromRole(
    requestedBy: TokenUser,
    dto: RemovePermissionsFromRoleDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      throw new CustomError(HTTP_EXCEPTIONS.FORBIDDEN);
    }

    const { roleId, permissionIds } = dto;

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new CustomError(HTTP_EXCEPTIONS.ROLE_NOT_FOUND);
    }

    const deletedAssignments = await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId: { in: permissionIds },
      },
    });

    return { success: true, removedCount: deletedAssignments.count };
  }

  async findPermissionsByRole(requestedBy: TokenUser, roleId: string) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: {
              include: {
                module: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!role) {
      throw new CustomError(HTTP_EXCEPTIONS.ROLE_NOT_FOUND);
    }

    return role.permissions.map((rp) => rp.permission);
  }
}
