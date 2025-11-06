import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { hasPermission } from '@api/utils';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';

import {
  AttendanceRecordCreateDto,
  AttendanceRecordBulkCreateDto,
  AttendanceRecordUpdateDto,
  AttendanceRecordFindAllDto,
  AttendanceSummaryCreateDto,
  AttendanceSummaryUpdateDto,
  AttendanceSummaryFindAllDto,
  AttendanceNotificationCreateDto,
  AttendanceNotificationUpdateDto,
  AttendanceNotificationFindAllDto,
} from './attendanceModel';

@Service()
export class AttendanceService {
  async findAllAttendanceRecords(
    requestedBy: TokenUser,
    filterDto: AttendanceRecordFindAllDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;
    const page = filterDto.page || 0;
    let orderBy: Prisma.AttendanceRecordOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.AttendanceRecordOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.AttendanceRecordWhereInput = {};

    if (filterDto.studentId) {
      where.studentId = filterDto.studentId;
    }

    if (filterDto.classroomIntegrationSessionId) {
      where.classroomIntegrationSessionId =
        filterDto.classroomIntegrationSessionId;
    }

    if (filterDto.status?.length) {
      where.status = { in: filterDto.status };
    }

    if (filterDto.sessionDateFrom || filterDto.sessionDateTo) {
      where.classroomIntegrationSession = {
        startDate: filterDto.sessionDateFrom
          ? { gte: filterDto.sessionDateFrom }
          : undefined,
        endDate: filterDto.sessionDateTo
          ? { lte: filterDto.sessionDateTo }
          : undefined,
      };
    }

    if (q) {
      where = {
        ...where,
        OR: [
          { student: { firstName: { contains: q, mode: 'insensitive' } } },
          { student: { lastName: { contains: q, mode: 'insensitive' } } },
          { student: { email: { contains: q, mode: 'insensitive' } } },
          { remarks: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [attendanceRecords, count] = await Promise.all([
      prisma.attendanceRecord.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          classroomIntegrationSession: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.attendanceRecord.count({ where }),
    ]);

    return { attendanceRecords, count };
  }

  async findOneAttendanceRecord(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const attendanceRecord = await prisma.attendanceRecord.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        classroomIntegrationSession: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!attendanceRecord) {
      throw new CustomError(HTTP_EXCEPTIONS.ATTENDANCE_RECORD_NOT_FOUND);
    }

    return attendanceRecord;
  }

  async createAttendanceRecord(
    requestedBy: TokenUser,
    createDto: AttendanceRecordCreateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: createDto.studentId, branchId: requestedBy.activeBranchId },
    });

    if (!student) {
      throw new CustomError(HTTP_EXCEPTIONS.STUDENT_NOT_FOUND);
    }

    // Check if classroom integration session exists (if provided)
    if (createDto.classroomIntegrationSessionId) {
      const session = await prisma.classroomIntegrationSession.findUnique({
        where: {
          id: createDto.classroomIntegrationSessionId,
          classroomIntegration: {
            classroom: {
              branchId: requestedBy.activeBranchId,
            },
          },
        },
      });

      if (!session) {
        throw new CustomError(
          HTTP_EXCEPTIONS.CLASSROOM_INTEGRATION_SESSION_NOT_FOUND
        );
      }
    }

    const attendanceRecord = await prisma.attendanceRecord.create({
      data: {
        ...createDto,
        createdBy: requestedBy.id,
      },
    });

    return attendanceRecord;
  }

  async createAttendanceRecords(
    requestedBy: TokenUser,
    createDtos: AttendanceRecordBulkCreateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Extract unique student IDs and classroom integration session IDs
    const studentIds = [...new Set(createDtos.map((dto) => dto.studentId))];
    const sessionIds = [
      ...new Set(
        createDtos
          .map((dto) => dto.classroomIntegrationSessionId)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    // Validate all students exist
    const students = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        branchId: requestedBy.activeBranchId,
      },
    });

    if (students.length !== studentIds.length) {
      const foundStudentIds = students.map((student) => student.id);
      const missingStudentIds = studentIds.filter(
        (id) => !foundStudentIds.includes(id)
      );
      throw new CustomError({
        status: HTTP_EXCEPTIONS.STUDENT_NOT_FOUND.status,
        message: {
          en: `Students not found: ${missingStudentIds.join(', ')}`,
          tr: `Öğrenciler bulunamadı: ${missingStudentIds.join(', ')}`,
        },
      });
    }

    // Validate all classroom integration sessions exist (if provided)
    if (sessionIds.length > 0) {
      const sessions = await prisma.classroomIntegrationSession.findMany({
        where: {
          id: { in: sessionIds },
          classroomIntegration: {
            classroom: {
              branchId: requestedBy.activeBranchId,
            },
          },
        },
      });

      if (sessions.length !== sessionIds.length) {
        const foundSessionIds = sessions.map((session) => session.id);
        const missingSessionIds = sessionIds.filter(
          (id) => !foundSessionIds.includes(id)
        );
        throw new CustomError({
          status:
            HTTP_EXCEPTIONS.CLASSROOM_INTEGRATION_SESSION_NOT_FOUND.status,
          message: {
            en: `Classroom integration sessions not found: ${missingSessionIds.join(', ')}`,
            tr: `Sınıf entegrasyon oturumları bulunamadı: ${missingSessionIds.join(', ')}`,
          },
        });
      }
    }

    const attendanceRecords = await prisma.attendanceRecord.createManyAndReturn(
      {
        data: createDtos.map((createDto) => ({
          ...createDto,
          createdBy: requestedBy.id,
        })),
      }
    );

    return attendanceRecords;
  }

  async saveAttendanceRecords(
    requestedBy: TokenUser,
    createDtos: AttendanceRecordBulkCreateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Extract unique student IDs and classroom integration session IDs
    const studentIds = [...new Set(createDtos.map((dto) => dto.studentId))];
    const sessionIds = [
      ...new Set(
        createDtos
          .map((dto) => dto.classroomIntegrationSessionId)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    // Validate all students exist
    const students = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        branchId: requestedBy.activeBranchId,
      },
    });

    if (students.length !== studentIds.length) {
      const foundStudentIds = students.map((student) => student.id);
      const missingStudentIds = studentIds.filter(
        (id) => !foundStudentIds.includes(id)
      );
      throw new CustomError({
        status: HTTP_EXCEPTIONS.STUDENT_NOT_FOUND.status,
        message: {
          en: `Students not found: ${missingStudentIds.join(', ')}`,
          tr: `Öğrenciler bulunamadı: ${missingStudentIds.join(', ')}`,
        },
      });
    }

    // Validate all classroom integration sessions exist (if provided)
    if (sessionIds.length > 0) {
      const sessions = await prisma.classroomIntegrationSession.findMany({
        where: {
          id: { in: sessionIds },
          classroomIntegration: {
            classroom: {
              branchId: requestedBy.activeBranchId,
            },
          },
        },
      });

      if (sessions.length !== sessionIds.length) {
        const foundSessionIds = sessions.map((session) => session.id);
        const missingSessionIds = sessionIds.filter(
          (id) => !foundSessionIds.includes(id)
        );
        throw new CustomError({
          status:
            HTTP_EXCEPTIONS.CLASSROOM_INTEGRATION_SESSION_NOT_FOUND.status,
          message: {
            en: `Classroom integration sessions not found: ${missingSessionIds.join(', ')}`,
            tr: `Sınıf entegrasyon oturumları bulunamadı: ${missingSessionIds.join(', ')}`,
          },
        });
      }
    }

    const newAttendanceRecords = createDtos.filter((dto) => !dto.id);
    const updatedAttendanceRecords = createDtos.filter((dto) => dto.id);

    await prisma.$transaction(
      async (tx) => {
        await tx.attendanceRecord.createManyAndReturn({
          data: newAttendanceRecords.map((createDto) => ({
            ...createDto,
            createdBy: requestedBy.id,
          })),
        });

        await Promise.all(
          updatedAttendanceRecords.map((dto) => {
            return tx.attendanceRecord.update({
              where: { id: dto.id },
              data: dto,
            });
          })
        );
      },
      { timeout: 30000 }
    );

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        classroomIntegrationSessionId: { in: sessionIds },
      },
    });

    return attendanceRecords;
  }

  async updateAttendanceRecord(
    requestedBy: TokenUser,
    updateDto: AttendanceRecordUpdateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, ...data } = updateDto;

    const existingRecord = await prisma.attendanceRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new CustomError(HTTP_EXCEPTIONS.ATTENDANCE_RECORD_NOT_FOUND);
    }

    const attendanceRecord = await prisma.attendanceRecord.update({
      where: { id },
      data,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        classroomIntegrationSession: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return attendanceRecord;
  }

  async deleteAttendanceRecord(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const existingRecord = await prisma.attendanceRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new CustomError(HTTP_EXCEPTIONS.ATTENDANCE_RECORD_NOT_FOUND);
    }

    await prisma.attendanceRecord.delete({
      where: { id },
    });

    return id;
  }

  // ============================================================================
  // ATTENDANCE SUMMARY METHODS
  // ============================================================================

  async findAllAttendanceSummaries(
    requestedBy: TokenUser,
    filterDto: AttendanceSummaryFindAllDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;
    const page = filterDto.page || 0;
    let orderBy: Prisma.AttendanceSummaryOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.AttendanceSummaryOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.AttendanceSummaryWhereInput = {};

    if (filterDto.studentId) {
      where.studentId = filterDto.studentId;
    }

    if (filterDto.month) {
      where.month = filterDto.month;
    }

    if (filterDto.year) {
      where.year = filterDto.year;
    }

    if (filterDto.classroomIntegrationId) {
      where.classroomIntegrationId = filterDto.classroomIntegrationId;
    }

    if (q) {
      where = {
        ...where,
        OR: [
          { student: { firstName: { contains: q, mode: 'insensitive' } } },
          { student: { lastName: { contains: q, mode: 'insensitive' } } },
          { student: { email: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [attendanceSummaries, count] = await Promise.all([
      prisma.attendanceSummary.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          classroomIntegration: {
            select: {
              id: true,
              classroom: {
                select: {
                  id: true,
                  name: true,
                },
              },
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.attendanceSummary.count({ where }),
    ]);

    return { attendanceSummaries, count };
  }

  async findOneAttendanceSummary(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const attendanceSummary = await prisma.attendanceSummary.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        classroomIntegration: {
          select: {
            id: true,
            classroom: {
              select: {
                id: true,
                name: true,
              },
            },
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!attendanceSummary) {
      throw new CustomError(HTTP_EXCEPTIONS.ATTENDANCE_SUMMARY_NOT_FOUND);
    }

    return attendanceSummary;
  }

  async createAttendanceSummary(
    requestedBy: TokenUser,
    createDto: AttendanceSummaryCreateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: createDto.studentId },
    });

    if (!student) {
      throw new CustomError(HTTP_EXCEPTIONS.STUDENT_NOT_FOUND);
    }

    // Check if classroom integration exists (if provided)
    if (createDto.classroomIntegrationId) {
      const integration = await prisma.classroomIntegration.findUnique({
        where: { id: createDto.classroomIntegrationId },
      });

      if (!integration) {
        throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_INTEGRATION_NOT_FOUND);
      }
    }

    const attendanceSummary = await prisma.attendanceSummary.create({
      data: createDto,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        classroomIntegration: {
          select: {
            id: true,
            classroom: {
              select: {
                id: true,
                name: true,
              },
            },
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return attendanceSummary;
  }

  async updateAttendanceSummary(
    requestedBy: TokenUser,
    updateDto: AttendanceSummaryUpdateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, ...data } = updateDto;

    const existingSummary = await prisma.attendanceSummary.findUnique({
      where: { id },
    });

    if (!existingSummary) {
      throw new CustomError(HTTP_EXCEPTIONS.ATTENDANCE_SUMMARY_NOT_FOUND);
    }

    const attendanceSummary = await prisma.attendanceSummary.update({
      where: { id },
      data,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        classroomIntegration: {
          select: {
            id: true,
            classroom: {
              select: {
                id: true,
                name: true,
              },
            },
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return attendanceSummary;
  }

  async deleteAttendanceSummary(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const existingSummary = await prisma.attendanceSummary.findUnique({
      where: { id },
    });

    if (!existingSummary) {
      throw new CustomError(HTTP_EXCEPTIONS.ATTENDANCE_SUMMARY_NOT_FOUND);
    }

    await prisma.attendanceSummary.delete({
      where: { id },
    });

    return id;
  }

  // ============================================================================
  // ATTENDANCE NOTIFICATION METHODS
  // ============================================================================

  async findAllAttendanceNotifications(
    requestedBy: TokenUser,
    filterDto: AttendanceNotificationFindAllDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;
    const page = filterDto.page || 0;
    let orderBy: Prisma.AttendanceNotificationOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.AttendanceNotificationOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.AttendanceNotificationWhereInput = {};

    if (filterDto.studentId) {
      where.studentId = filterDto.studentId;
    }

    if (filterDto.classroomIntegrationId) {
      where.classroomIntegrationId = filterDto.classroomIntegrationId;
    }

    if (filterDto.notificationType?.length) {
      where.notificationType = { in: filterDto.notificationType };
    }

    if (filterDto.status?.length) {
      where.status = { in: filterDto.status };
    }

    if (filterDto.notificationDateFrom || filterDto.notificationDateTo) {
      where.notificationDate = {};
      if (filterDto.notificationDateFrom) {
        where.notificationDate.gte = filterDto.notificationDateFrom;
      }
      if (filterDto.notificationDateTo) {
        where.notificationDate.lte = filterDto.notificationDateTo;
      }
    }

    if (q) {
      where = {
        ...where,
        OR: [
          { student: { firstName: { contains: q, mode: 'insensitive' } } },
          { student: { lastName: { contains: q, mode: 'insensitive' } } },
          { student: { email: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [attendanceNotifications, count] = await Promise.all([
      prisma.attendanceNotification.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          classroomIntegration: {
            select: {
              id: true,
              classroom: {
                select: {
                  id: true,
                  name: true,
                },
              },
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.attendanceNotification.count({ where }),
    ]);

    return { attendanceNotifications, count };
  }

  async findOneAttendanceNotification(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const attendanceNotification =
      await prisma.attendanceNotification.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          classroomIntegration: {
            select: {
              id: true,
              classroom: {
                select: {
                  id: true,
                  name: true,
                },
              },
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

    if (!attendanceNotification) {
      throw new CustomError(HTTP_EXCEPTIONS.ATTENDANCE_NOTIFICATION_NOT_FOUND);
    }

    return attendanceNotification;
  }

  async createAttendanceNotification(
    requestedBy: TokenUser,
    createDto: AttendanceNotificationCreateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: createDto.studentId },
    });

    if (!student) {
      throw new CustomError(HTTP_EXCEPTIONS.STUDENT_NOT_FOUND);
    }

    // Check if classroom integration exists (if provided)
    if (createDto.classroomIntegrationId) {
      const integration = await prisma.classroomIntegration.findUnique({
        where: { id: createDto.classroomIntegrationId },
      });

      if (!integration) {
        throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_INTEGRATION_NOT_FOUND);
      }
    }

    const attendanceNotification = await prisma.attendanceNotification.create({
      data: createDto,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        classroomIntegration: {
          select: {
            id: true,
            classroom: {
              select: {
                id: true,
                name: true,
              },
            },
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return attendanceNotification;
  }

  async updateAttendanceNotification(
    requestedBy: TokenUser,
    updateDto: AttendanceNotificationUpdateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, ...data } = updateDto;

    const existingNotification = await prisma.attendanceNotification.findUnique(
      {
        where: { id },
      }
    );

    if (!existingNotification) {
      throw new CustomError(HTTP_EXCEPTIONS.ATTENDANCE_NOTIFICATION_NOT_FOUND);
    }

    const attendanceNotification = await prisma.attendanceNotification.update({
      where: { id },
      data,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        classroomIntegration: {
          select: {
            id: true,
            classroom: {
              select: {
                id: true,
                name: true,
              },
            },
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return attendanceNotification;
  }

  async deleteAttendanceNotification(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasWritePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.write
      );

      if (!userHasWritePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const existingNotification = await prisma.attendanceNotification.findUnique(
      {
        where: { id },
      }
    );

    if (!existingNotification) {
      throw new CustomError(HTTP_EXCEPTIONS.ATTENDANCE_NOTIFICATION_NOT_FOUND);
    }

    await prisma.attendanceNotification.delete({
      where: { id },
    });

    return id;
  }
}
