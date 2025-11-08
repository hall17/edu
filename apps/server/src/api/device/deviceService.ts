import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import {
  deviceAssignmentInclude,
  deviceFindMyDevicesInclude,
  deviceInclude,
} from '@api/libs/prisma/selections';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { hasPermission } from '@api/utils';
import { AssignmentStatus, DeviceStatus } from '@edusama/common';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';

import {
  DeviceAssignDto,
  DeviceCreateDto,
  DeviceFindAllDto,
  DeviceFindMyDevicesDto,
  DeviceReturnDto,
  DeviceUpdateDto,
} from './deviceModel';

@Service()
export class DeviceService {
  async findAll(requestedBy: TokenUser, filterDto: DeviceFindAllDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.inventory,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 1;
    let orderBy: Prisma.DeviceOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.DeviceOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.DeviceWhereInput = {
      branch: requestedBy.isSuperAdmin
        ? requestedBy.branchIds.length
          ? {
              id: {
                in: requestedBy.branchIds,
              },
            }
          : undefined
        : { id: requestedBy.activeBranchId },
      deviceType: {
        in: filterDto.deviceType || undefined,
      },
      status: {
        in: filterDto.status || undefined,
      },
      condition: {
        in: filterDto.condition || undefined,
      },
      users: {
        some: {
          userId: {
            in: filterDto.userIds || undefined,
          },
        },
      },
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { serialNumber: { contains: q, mode: 'insensitive' } },
          { assetTag: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
          { model: { contains: q, mode: 'insensitive' } },
          { supplier: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [devices, count] = await Promise.all([
      prisma.device.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: deviceInclude,
      }),
      prisma.device.count({
        where,
      }),
    ]);

    return {
      devices,
      count,
    };
  }

  async findOne(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.inventory,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const device = await prisma.device.findUnique({
      where: {
        id,
        branch: requestedBy.isSuperAdmin
          ? requestedBy.branchIds.length
            ? {
                id: {
                  in: requestedBy.branchIds,
                },
              }
            : undefined
          : { id: requestedBy.activeBranchId },
      },
      include: deviceInclude,
    });

    if (!device) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    return device;
  }

  async create(requestedBy: TokenUser, dto: DeviceCreateDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.inventory,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const isUserAuthorized =
      requestedBy.isSuperAdmin || requestedBy.branchIds.includes(dto.branchId);

    if (!isUserAuthorized) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    // Check if serial number already exists
    const existingDevice = await prisma.device.findUnique({
      where: { serialNumber: dto.serialNumber },
    });

    if (existingDevice) {
      throw new CustomError(
        HTTP_EXCEPTIONS.DEVICE_WITH_THIS_SERIAL_NUMBER_ALREADY_EXISTS
      );
    }

    // Check if asset tag already exists (if provided)
    if (dto.assetTag) {
      const existingAssetTag = await prisma.device.findUnique({
        where: { assetTag: dto.assetTag },
      });

      if (existingAssetTag) {
        throw new CustomError(
          HTTP_EXCEPTIONS.DEVICE_WITH_THIS_ASSET_TAG_ALREADY_EXISTS
        );
      }
    }

    const device = await prisma.device.create({
      data: dto,
      include: deviceInclude,
    });

    return device;
  }

  async update(requestedBy: TokenUser, dto: DeviceUpdateDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.inventory,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    if (dto.branchId) {
      const isUserAuthorized =
        requestedBy.isSuperAdmin ||
        requestedBy.branchIds.includes(dto.branchId);

      if (!isUserAuthorized) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const device = await prisma.device.findUnique({
      where: { id: dto.id },
      select: { id: true, branchId: true },
    });

    if (!device) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    // Check if user has access to the device's branch
    const hasAccess =
      requestedBy.isSuperAdmin ||
      requestedBy.branchIds.includes(device.branchId);

    if (!hasAccess) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    // Check serial number uniqueness if being updated
    if (dto.serialNumber) {
      const existingDevice = await prisma.device.findFirst({
        where: {
          serialNumber: dto.serialNumber,
          NOT: { id: dto.id },
        },
      });

      if (existingDevice) {
        throw new CustomError(
          HTTP_EXCEPTIONS.DEVICE_WITH_THIS_SERIAL_NUMBER_ALREADY_EXISTS
        );
      }
    }

    // Check asset tag uniqueness if being updated
    if (dto.assetTag) {
      const existingAssetTag = await prisma.device.findFirst({
        where: {
          assetTag: dto.assetTag,
          NOT: { id: dto.id },
        },
      });

      if (existingAssetTag) {
        throw new CustomError(
          HTTP_EXCEPTIONS.DEVICE_WITH_THIS_ASSET_TAG_ALREADY_EXISTS
        );
      }
    }

    const updatedDevice = await prisma.device.update({
      where: { id: dto.id },
      data: dto,
      include: deviceInclude,
    });

    return updatedDevice;
  }

  async delete(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasDeletePermission = hasPermission(
        requestedBy,
        MODULE_CODES.inventory,
        PERMISSIONS.delete
      );

      if (!userHasDeletePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const device = await prisma.device.findUnique({
      where: { id },
      select: { id: true, branchId: true, status: true },
    });

    if (!device) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    // Check if user has access to the device's branch
    const hasAccess =
      requestedBy.isSuperAdmin ||
      requestedBy.branchIds.includes(device.branchId);

    if (!hasAccess) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    // Check if device is currently assigned
    if (device.status === DeviceStatus.ASSIGNED) {
      throw new CustomError(HTTP_EXCEPTIONS.CANNOT_DELETE_ASSIGNED_DEVICE);
    }

    await prisma.device.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    return id;
  }

  async assignDevice(requestedBy: TokenUser, dto: DeviceAssignDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.inventory,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const device = await prisma.device.findUnique({
      where: { id: dto.deviceId },
      select: { id: true, branchId: true, status: true },
    });

    if (!device) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    // Check if user has access to the device's branch
    const hasAccess =
      requestedBy.isSuperAdmin ||
      requestedBy.branchIds.includes(device.branchId);

    if (!hasAccess) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    // Check if device is available
    if (device.status !== DeviceStatus.AVAILABLE) {
      throw new CustomError(
        HTTP_EXCEPTIONS.DEVICE_NOT_AVAILABLE_FOR_ASSIGNMENT
      );
    }

    // Check if user exists and belongs to the same branch
    const user = await prisma.user.findUnique({
      where: { id: dto.userId },
      include: {
        branches: true,
      },
    });

    if (!user) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const userInBranch = user.branches.some(
      (branch) => branch.branchId === device.branchId
    );

    if (!userInBranch) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const assignment = await prisma.$transaction(async (tx) => {
      // Update device status to assigned
      await tx.device.update({
        where: { id: dto.deviceId },
        data: { status: DeviceStatus.ASSIGNED },
      });

      // Create assignment record
      const assignment = await tx.userDevice.create({
        data: {
          deviceId: dto.deviceId,
          userId: dto.userId,
          expectedReturnAt: dto.expectedReturnAt,
          assignmentNotes: dto.assignmentNotes,
          conditionAtAssignment: dto.conditionAtAssignment,
          status: AssignmentStatus.ACTIVE,
        },
        include: deviceAssignmentInclude,
      });

      return assignment;
    });

    return assignment;
  }

  async returnDevice(requestedBy: TokenUser, dto: DeviceReturnDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.inventory,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const assignment = await prisma.userDevice.findUnique({
      where: { id: dto.assignmentId },
      include: {
        device: {
          select: { id: true, branchId: true },
        },
      },
    });

    if (!assignment) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    // Check if user has access to the device's branch
    const hasAccess =
      requestedBy.isSuperAdmin ||
      requestedBy.branchIds.includes(assignment.device.branchId);

    if (!hasAccess) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    // Check if assignment is active
    if (assignment.status !== AssignmentStatus.ACTIVE) {
      throw new CustomError(HTTP_EXCEPTIONS.ASSIGNMENT_NOT_ACTIVE);
    }

    const updatedAssignment = await prisma.$transaction(async (tx) => {
      // Update device status to available
      await tx.device.update({
        where: { id: assignment.deviceId },
        data: { status: DeviceStatus.AVAILABLE },
      });

      // Update assignment record
      const updatedAssignment = await tx.userDevice.update({
        where: { id: dto.assignmentId },
        data: {
          returnedAt: new Date(),
          returnNotes: dto.returnNotes,
          conditionAtReturn: dto.conditionAtReturn,
          status: AssignmentStatus.RETURNED,
        },
        include: deviceAssignmentInclude,
      });

      return updatedAssignment;
    });

    return updatedAssignment;
  }

  async findMyDevices(
    requestedBy: TokenUser,
    filterDto: DeviceFindMyDevicesDto
  ) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.inventory,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 1;
    let orderBy: Prisma.UserDeviceOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.UserDeviceOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.assignedAt = 'desc';
    }

    let where: Prisma.UserDeviceWhereInput = {
      userId: requestedBy.id,
      device: {
        deviceType: {
          in: filterDto.deviceType || undefined,
        },
        condition: {
          in: filterDto.condition || undefined,
        },
      },
      status: {
        in: filterDto.status || undefined,
      },
      deviceId: filterDto.deviceId || undefined,
    };

    if (q) {
      where = {
        ...where,
        OR: [
          {
            device: {
              serialNumber: { contains: q, mode: 'insensitive' },
            },
          },
          {
            device: {
              assetTag: { contains: q, mode: 'insensitive' },
            },
          },
          {
            device: {
              model: { contains: q, mode: 'insensitive' },
            },
          },
          {
            device: {
              brand: { contains: q, mode: 'insensitive' },
            },
          },
          {
            device: {
              supplier: { contains: q, mode: 'insensitive' },
            },
          },
        ],
      };
    }

    const [devices, count] = await Promise.all([
      prisma.userDevice.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        take: size,
        where,
        orderBy,
        include: deviceFindMyDevicesInclude,
      }),
      prisma.userDevice.count({
        where,
      }),
    ]);

    return {
      devices,
      count,
    };
  }

  async findMyDevice(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.inventory,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const assignment = await prisma.userDevice.findUnique({
      where: { id, userId: requestedBy.id },
      include: deviceFindMyDevicesInclude,
    });

    if (!assignment) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    return assignment;
  }
}
