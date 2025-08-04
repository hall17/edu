import { HTTP_EXCEPTIONS } from '@api/constants';
import {
  classroomInclude,
  classroomIntegrationInclude,
  classroomIntegrationIncludeFindOne,
  classroomIntegrationSessionInclude,
  classroomStudentInclude,
} from '@api/libs/prisma/selections';
import { generateSignedUrl } from '@api/libs/s3';
import { CustomError, TokenUser } from '@api/types';
import { decrypt } from '@api/utils';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { Prisma } from '@prisma/client';
import Container, { Service } from 'typedi';

import { prisma } from '@api/libs/prisma';
import { PAGE_SIZE } from '../../utils/constants';
import { hasPermission } from '../../utils/hasPermission';
import { StudentService } from '../student/studentService';

import {
  ClassroomCreateDto,
  ClassroomFindAllDto,
  ClassroomUpdateDto,
  EnrollStudentDto,
  UpdateStudentEnrollmentStatusDto,
  UnenrollStudentDto,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  ClassroomStudentsFindAllDto,
  CreateIntegrationSessionDto,
  UpdateIntegrationSessionDto,
  FindAllClassroomIntegrationsDto,
  ClassroomIntegrationSessionFindAllDto,
  ClassroomUpdateStatusDto,
} from './classroomModel';

type ClassroomStudentReturnType = Prisma.ClassroomStudentGetPayload<{
  include: typeof classroomStudentInclude;
}>;
@Service()
export class ClassroomService {
  constructor(private readonly studentService: StudentService) {
    this.studentService = Container.get(StudentService);
  }

  async findAll(requestedBy: TokenUser, filterDto: ClassroomFindAllDto) {
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
    let orderBy: Prisma.ClassroomOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order as Prisma.SortOrder };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.ClassroomWhereInput = {
      branchId:
        filterDto.global && requestedBy.isSuperAdmin
          ? filterDto.branchIds?.length
            ? {
                in: filterDto.branchIds,
              }
            : undefined
          : requestedBy.activeBranchId,
      classroomTemplateId: filterDto.classroomTemplateIds?.length
        ? {
            in: filterDto.classroomTemplateIds,
          }
        : undefined,
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { classroomTemplate: { name: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [classrooms, count] = await Promise.all([
      prisma.classroom.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: classroomInclude,
      }),
      prisma.classroom.count({
        where,
      }),
    ]);

    return {
      classrooms,
      count,
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

    const classroom = await prisma.classroom.findUnique({
      where: {
        id,
        branchId: requestedBy.isSuperAdmin
          ? undefined
          : requestedBy.activeBranchId,
        deletedAt: null,
      },
      include: classroomInclude,
    });

    if (!classroom) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_NOT_FOUND);
    }

    return classroom;
  }

  async create(requestedBy: TokenUser, dto: ClassroomCreateDto) {
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

    const { moduleIds, integrations, classroomTemplateId, ...classroomData } =
      dto;

    // Get classroom template with modules and schedules if provided
    let classroomTemplate = null;

    if (classroomTemplateId) {
      classroomTemplate = await prisma.classroomTemplate.findUnique({
        where: {
          id: classroomTemplateId,
          branchId: requestedBy.isSuperAdmin
            ? undefined
            : requestedBy.activeBranchId,
          deletedAt: null,
        },
        include: {
          modules: {
            include: {
              module: true,
            },
          },
        },
      });

      if (!classroomTemplate) {
        throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_TEMPLATE_NOT_FOUND);
      }
    }

    // Check if classroom with same name already exists in the branch
    const existingClassroom = await prisma.classroom.findFirst({
      where: {
        branchId: requestedBy.activeBranchId,
        name: dto.name,
      },
    });

    if (existingClassroom) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_ALREADY_EXISTS);
    }

    // Prepare final classroom data
    let finalClassroomData = {
      ...classroomData,
      classroomTemplateId,
    };

    let moduleIdsToCreate = moduleIds;

    // If using template, merge template data with provided data
    if (classroomTemplate) {
      finalClassroomData = {
        // Use template values as defaults
        description:
          classroomData.description ??
          classroomTemplate.description ??
          undefined,
        capacity: classroomData.capacity ?? classroomTemplate.capacity,
        imageUrl:
          classroomData.imageUrl ?? classroomTemplate.imageUrl ?? undefined,
        attendancePassPercentage:
          classroomData.attendancePassPercentage ??
          classroomTemplate.attendancePassPercentage,
        assessmentScorePass:
          classroomData.assessmentScorePass ??
          classroomTemplate.assessmentScorePass,
        assignmentScorePass:
          classroomData.assignmentScorePass ??
          classroomTemplate.assignmentScorePass,
        attendanceThreshold:
          classroomData.attendanceThreshold ??
          classroomTemplate.attendanceThreshold ??
          undefined,
        reminderFrequency:
          classroomData.reminderFrequency ??
          classroomTemplate.reminderFrequency ??
          undefined,
        accessLink: classroomData.accessLink,
        // Keep required fields from original data
        name: classroomData.name,
        startDate: classroomData.startDate,
        endDate: classroomData.endDate,
        classroomTemplateId,
      };

      moduleIdsToCreate =
        moduleIds ?? classroomTemplate.modules.map((module) => module.moduleId);
    }

    // Create classroom with modules and schedules in a transaction
    const classroom = await prisma.$transaction(
      async (tx) => {
        // Create the classroom
        const createdClassroom = await tx.classroom.create({
          data: {
            ...finalClassroomData,
            branchId: requestedBy.activeBranchId,
            ...(moduleIdsToCreate &&
              moduleIdsToCreate.length > 0 && {
                modules: {
                  createMany: {
                    data: moduleIdsToCreate?.map((moduleId) => ({
                      moduleId,
                    })),
                  },
                },
              }),
          },
          include: classroomInclude,
        });

        for (const integration of integrations ?? []) {
          const { schedules, ...integrationData } = integration;
          await tx.classroomIntegration.create({
            data: {
              ...integrationData,
              classroomId: createdClassroom.id,
              schedules:
                schedules && schedules.length > 0
                  ? {
                      createMany: {
                        data: schedules.map((schedule) => ({
                          ...schedule,
                        })),
                      },
                    }
                  : undefined,
            },
          });
        }

        // Return the complete classroom with includes
        return tx.classroom.findUnique({
          where: { id: createdClassroom.id },
          include: classroomInclude,
        });
      },
      { timeout: 30000 }
    );

    return classroom!;
  }

  async update(requestedBy: TokenUser, dto: ClassroomUpdateDto) {
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

    const { id, moduleIds, integrations, ...updateData } = dto;

    const existingClassroom = await prisma.classroom.findUnique({
      where: {
        id,
        branchId: requestedBy.isSuperAdmin
          ? undefined
          : requestedBy.activeBranchId,
        deletedAt: null,
      },
      include: {
        integrations: true,
      },
    });

    if (!existingClassroom) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_NOT_FOUND);
    }

    // If updating classroomTemplateId, check if template exists
    if (updateData.classroomTemplateId) {
      const classroomTemplate = await prisma.classroomTemplate.findUnique({
        where: { id: updateData.classroomTemplateId },
      });

      if (!classroomTemplate) {
        throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_TEMPLATE_NOT_FOUND);
      }
    }

    // Check if classroom with same name already exists in the branch (excluding current classroom)
    if (updateData.name) {
      const existingClassroomWithName = await prisma.classroom.findFirst({
        where: {
          branchId: requestedBy.activeBranchId,
          name: updateData.name,
          id: { not: id },
        },
      });

      if (existingClassroomWithName) {
        throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_ALREADY_EXISTS);
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

    // Update classroom with modules and schedules in a transaction
    const classroom = await prisma.$transaction(async (tx) => {
      // Update the classroom
      await tx.classroom.update({
        where: { id },
        data: updateData,
        include: classroomInclude,
      });

      // Update modules if provided
      if (moduleIds !== undefined) {
        // Delete existing modules
        await tx.classroomModule.deleteMany({
          where: { classroomId: id },
        });

        // Add new modules if provided
        if (moduleIds.length > 0) {
          await tx.classroomModule.createMany({
            data: moduleIds.map((moduleId) => ({
              classroomId: id,
              moduleId,
            })),
          });
        }
      }

      // Update schedules if provided
      if (integrations !== undefined) {
        // without id
        const addedIntegrations = integrations.filter(
          (integration) => integration.id === undefined
        );
        // updated integrations
        const updatedIntegrations = integrations.filter(
          (integration) => integration.id !== undefined
        );
        // exist in classroom data but not in integrations
        const deletedIntegrations = existingClassroom.integrations.filter(
          (integration) => !integrations.some((i) => i.id === integration.id)
        );

        // Delete existing integrations
        await tx.classroomIntegration.deleteMany({
          where: {
            id: { in: deletedIntegrations.map((i) => i.id) },
            classroom: {
              branchId: requestedBy.activeBranchId,
            },
          },
        });

        // Update existing integrations
        await Promise.all(
          updatedIntegrations.map(async (integration) => {
            const { schedules, ...integrationData } = integration;
            await tx.classroomIntegration.update({
              where: { id: integration.id },
              data: integrationData,
            });

            if (schedules && schedules.length > 0) {
              await tx.classroomIntegrationSchedule.deleteMany({
                where: { classroomIntegrationId: integration.id },
              });
              await tx.classroomIntegrationSchedule.createMany({
                data: schedules.map((schedule) => ({
                  classroomIntegrationId: integration.id!,
                  ...schedule,
                })),
              });
            }
          })
        );

        // Add new integrations
        await Promise.all(
          addedIntegrations.map(async (integration) => {
            const { schedules, ...integrationData } = integration;
            await tx.classroomIntegration.create({
              data: {
                ...integrationData,
                classroomId: existingClassroom.id,
                schedules:
                  schedules && schedules.length > 0
                    ? {
                        createMany: {
                          data: schedules.map((schedule) => ({
                            ...schedule,
                          })),
                        },
                      }
                    : undefined,
              },
            });
          })
        );
      }

      // Return the complete classroom with includes
      return tx.classroom.findUnique({
        where: { id },
        include: classroomInclude,
      });
    });

    return classroom!;
  }

  async updateStatus(requestedBy: TokenUser, dto: ClassroomUpdateStatusDto) {
    // permission check
    if (!requestedBy.isSuperAdmin) {
      const userHasUpdatePermission = hasPermission(
        requestedBy,
        MODULE_CODES.classrooms,
        PERMISSIONS.write
      );

      if (!userHasUpdatePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    await prisma.classroom.update({
      where: { id: dto.id },
      data: {
        status: dto.status,
        statusUpdateReason: dto.statusUpdateReason,
        statusUpdatedAt: new Date(),
        statusUpdatedBy: requestedBy.id,
      },
    });

    return { success: true };
  }

  async delete(requestedBy: TokenUser, id: string) {
    // Check if user has permission to delete classrooms
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

    const existingClassroom = await prisma.classroom.findUnique({
      where: {
        id,
        branchId: requestedBy.isSuperAdmin
          ? undefined
          : requestedBy.activeBranchId,
        deletedAt: null,
      },
    });

    if (!existingClassroom) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_NOT_FOUND);
    }

    await prisma.classroom.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    return { success: true };
  }

  async findAllStudents(
    requestedBy: TokenUser,
    filterDto: ClassroomStudentsFindAllDto
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

    const page = filterDto.page || 0;
    let orderBy: Prisma.ClassroomStudentOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order as Prisma.SortOrder };
    } else {
      orderBy.enrolledAt = 'desc';
    }

    let where: Prisma.ClassroomStudentWhereInput = {
      student: {
        deletedAt: null,
        branchId:
          filterDto.global && requestedBy.isSuperAdmin
            ? requestedBy.branchIds.length
              ? { in: requestedBy.branchIds }
              : undefined
            : requestedBy.activeBranchId,
      },
      status: {
        in: filterDto.status || undefined,
      },
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { student: { email: { contains: q, mode: 'insensitive' } } },
          { student: { nationalId: { contains: q, mode: 'insensitive' } } },
          { student: { firstName: { contains: q, mode: 'insensitive' } } },
          { student: { lastName: { contains: q, mode: 'insensitive' } } },
          { student: { phoneNumber: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [classroomStudent, count] = await Promise.all([
      prisma.classroomStudent.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: classroomStudentInclude,
      }),
      prisma.classroomStudent.count({
        where,
      }),
    ]);

    const studentsWithData = await Promise.all(
      classroomStudent.map(async (studentOnClassroom) => {
        return this.createStudentData(requestedBy, studentOnClassroom);
      })
    );

    return {
      students: studentsWithData,
      pagination: {
        page,
        size,
        count,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async createAnnouncement(requestedBy: TokenUser, dto: CreateAnnouncementDto) {
    const existingClassroom = await prisma.classroom.findUnique({
      where: { id: dto.classroomId, branchId: requestedBy.activeBranchId },
    });

    if (!existingClassroom) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_NOT_FOUND);
    }

    await prisma.classroomAnnouncement.create({
      data: {
        classroomId: dto.classroomId,
        title: dto.title,
        content: dto.content,
      },
    });
  }

  async updateAnnouncement(requestedBy: TokenUser, dto: UpdateAnnouncementDto) {
    const existingAnnouncement = await prisma.classroomAnnouncement.findUnique({
      where: {
        id: dto.id,
        classroomId: dto.classroomId,
        classroom: {
          branchId: requestedBy.activeBranchId,
        },
      },
    });

    if (!existingAnnouncement) {
      throw new CustomError(HTTP_EXCEPTIONS.ANNOUNCEMENT_NOT_FOUND);
    }
  }

  async deleteAnnouncement(requestedBy: TokenUser, id: string) {
    const existingAnnouncement = await prisma.classroomAnnouncement.findUnique({
      where: { id, classroom: { branchId: requestedBy.activeBranchId } },
    });

    if (!existingAnnouncement) {
      throw new CustomError(HTTP_EXCEPTIONS.ANNOUNCEMENT_NOT_FOUND);
    }
  }

  async generateAccessLink(requestedBy: TokenUser, id: string) {
    const existingClassroom = await prisma.classroom.findUnique({
      where: { id, branchId: requestedBy.activeBranchId },
    });

    if (!existingClassroom) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_NOT_FOUND);
    }

    // generate zoom access link
    const accessLink = crypto.randomUUID();

    await prisma.classroom.update({
      where: { id },
      data: { accessLink },
    });

    return { accessLink };
  }

  async enrollStudent(requestedBy: TokenUser, dto: EnrollStudentDto) {
    const existingClassroom = await prisma.classroom.findUnique({
      where: { id: dto.classroomId, branchId: requestedBy.activeBranchId },
      select: {
        capacity: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (!existingClassroom) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_NOT_FOUND);
    }

    if (existingClassroom._count.students >= existingClassroom.capacity) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_AT_CAPACITY);
    }

    const existingStudent = await prisma.student.findUnique({
      where: { id: dto.studentId, branchId: requestedBy.activeBranchId },
    });

    if (!existingStudent) {
      throw new CustomError(HTTP_EXCEPTIONS.STUDENT_NOT_FOUND);
    }

    await prisma.classroomStudent.create({
      data: {
        classroomId: dto.classroomId,
        studentId: dto.studentId,
      },
    });

    return { success: true };
  }

  async unenrollStudent(requestedBy: TokenUser, dto: UnenrollStudentDto) {
    const existingClassroom = await prisma.classroom.findUnique({
      where: { id: dto.classroomId, branchId: requestedBy.activeBranchId },
    });

    if (!existingClassroom) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_NOT_FOUND);
    }

    await prisma.classroomStudent.delete({
      where: {
        classroomId_studentId: {
          classroomId: dto.classroomId,
          studentId: dto.studentId,
        },
      },
    });

    const existingStudentEnrollment = await prisma.classroomStudent.findUnique({
      where: {
        classroomId_studentId: {
          classroomId: dto.classroomId,
          studentId: dto.studentId,
        },
      },
    });

    if (!existingStudentEnrollment) {
      throw new CustomError(HTTP_EXCEPTIONS.STUDENT_NOT_ENROLLED);
    }

    return { success: true };
  }

  async updateStudentEnrollmentStatus(
    requestedBy: TokenUser,
    dto: UpdateStudentEnrollmentStatusDto
  ) {
    const existingClassroom = await prisma.classroom.findUnique({
      where: { id: dto.classroomId, branchId: requestedBy.activeBranchId },
    });

    if (!existingClassroom) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_NOT_FOUND);
    }

    await prisma.classroomStudent.update({
      where: {
        classroomId_studentId: {
          classroomId: dto.classroomId,
          studentId: dto.studentId,
        },
      },
      data: { status: dto.status },
    });
  }

  async findAllIntegrationSessions(
    requestedBy: TokenUser,
    filterDto: ClassroomIntegrationSessionFindAllDto
  ) {
    // Apply permission-based access control
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

    const page = filterDto.page || 1;
    let orderBy: Prisma.ClassroomIntegrationSessionOrderByWithRelationInput =
      {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order as Prisma.SortOrder };
    } else {
      orderBy.endDate = 'desc';
    }

    let where: Prisma.ClassroomIntegrationSessionWhereInput = {
      classroomIntegration: {
        classroom: {
          branchId: requestedBy.activeBranchId,
          id: filterDto.classroomId,
        },
      },
    };

    if (q) {
      where = {
        ...where,
        OR: [
          {
            teacher: {
              OR: [
                {
                  firstName: { contains: q, mode: 'insensitive' },
                },
                {
                  lastName: { contains: q, mode: 'insensitive' },
                },
              ],
            },
          },
          {
            classroomIntegration: {
              OR: [
                {
                  curriculum: {
                    lessons: {
                      some: {
                        name: { contains: q, mode: 'insensitive' },
                      },
                    },
                  },
                },
                {
                  subject: {
                    name: { contains: q, mode: 'insensitive' },
                  },
                },
                {
                  teacher: {
                    OR: [
                      {
                        firstName: { contains: q, mode: 'insensitive' },
                      },
                      {
                        lastName: { contains: q, mode: 'insensitive' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      };
    }

    const [integrationSessions, count] = await Promise.all([
      prisma.classroomIntegrationSession.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: classroomIntegrationSessionInclude,
      }),
      prisma.classroomIntegrationSession.count({
        where,
      }),
    ]);

    return {
      integrationSessions,
      pagination: {
        page,
        size,
        count,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async createIntegrationSession(
    requestedBy: TokenUser,
    dto: CreateIntegrationSessionDto
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

    const { lessonIds, attendanceRecords, ...rest } = dto;

    const integrationSession = await prisma.classroomIntegrationSession.create({
      data: {
        ...rest,
        lessons: lessonIds
          ? {
              createMany: {
                data: lessonIds.map((lessonId) => ({
                  lessonId,
                })),
              },
            }
          : undefined,
        attendanceRecords: attendanceRecords
          ? {
              createMany: {
                data: attendanceRecords.map((record) => {
                  return {
                    ...record,
                    createdBy: requestedBy.id,
                  };
                }),
              },
            }
          : undefined,
      },
    });

    return integrationSession;
  }

  async updateIntegrationSession(
    requestedBy: TokenUser,
    dto: UpdateIntegrationSessionDto
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

    const existingIntegrationSession =
      await prisma.classroomIntegrationSession.findUnique({
        where: {
          id: dto.id,
          classroomIntegration: {
            classroom: { branchId: requestedBy.activeBranchId },
          },
        },
        include: {
          attendanceRecords: true,
          lessons: true,
        },
      });

    if (!existingIntegrationSession) {
      throw new CustomError(
        HTTP_EXCEPTIONS.CLASSROOM_INTEGRATION_SESSION_NOT_FOUND
      );
    }

    // Handle lessons update - delete existing and create new ones if lessonIds provided
    const { lessonIds, attendanceRecords, ...updateData } = dto;

    const integrationSession = await prisma.$transaction(
      async (tx) => {
        if (lessonIds?.length) {
          const newLessons = lessonIds.filter(
            (lessonId) =>
              !existingIntegrationSession.lessons.some(
                (l) => l.lessonId === lessonId
              )
          );
          const deletedLessons = existingIntegrationSession.lessons.filter(
            (l) => !lessonIds.includes(l.lessonId)
          );

          for (const lesson of newLessons) {
            await tx.classroomIntegrationSessionLesson.create({
              data: {
                classroomIntegrationSessionId: existingIntegrationSession.id,
                lessonId: lesson,
              },
            });
          }

          for (const lesson of deletedLessons) {
            await tx.classroomIntegrationSessionLesson.delete({
              where: {
                classroomIntegrationSessionId_lessonId: {
                  classroomIntegrationSessionId: existingIntegrationSession.id,
                  lessonId: lesson.lessonId,
                },
              },
            });
          }
        }

        // Handle attendance records update - delete existing and create new ones if provided
        if (attendanceRecords !== undefined) {
          const newAttendanceRecords = attendanceRecords.filter(
            (record) =>
              !existingIntegrationSession.attendanceRecords.some(
                (r) => r.id === record.id
              )
          );
          const updatedAttendanceRecords = attendanceRecords.filter(
            (record) => {
              const existingRecord =
                existingIntegrationSession.attendanceRecords.find(
                  (r) => r.id === record.id
                );

              if (!existingRecord) {
                return false;
              }

              return (
                existingRecord?.remarks !== record.remarks ||
                existingRecord?.status !== record.status
              );
            }
          );

          for (const record of newAttendanceRecords) {
            await tx.attendanceRecord.create({
              data: {
                status: record.status,
                remarks: record.remarks,
                studentId: record.studentId,
                classroomIntegrationSessionId: existingIntegrationSession.id,
                createdBy: requestedBy.id,
              },
            });
          }

          for (const record of updatedAttendanceRecords) {
            await tx.attendanceRecord.update({
              where: { id: record.id },
              data: record,
            });
          }
        }

        const integrationSession = await tx.classroomIntegrationSession.update({
          where: { id: dto.id },
          data: updateData,
        });

        return integrationSession;
      },
      { timeout: 30000 }
    );

    return integrationSession;
  }

  async deleteIntegrationSession(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasDeletePermission = hasPermission(
        requestedBy,
        MODULE_CODES.attendance,
        PERMISSIONS.delete
      );

      if (!userHasDeletePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    await prisma.classroomIntegrationSession.delete({
      where: { id },
    });
  }

  async findAllClassroomIntegrations(
    requestedBy: TokenUser,
    filterDto: FindAllClassroomIntegrationsDto
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
    let orderBy: Prisma.ClassroomIntegrationOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order as Prisma.SortOrder };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.ClassroomIntegrationWhereInput = {
      classroom: {
        branchId:
          filterDto.global && requestedBy.isSuperAdmin
            ? filterDto.branchIds?.length
              ? {
                  in: filterDto.branchIds,
                }
              : undefined
            : requestedBy.activeBranchId,
      },
      classroomId: filterDto.classroomIds?.length
        ? {
            in: filterDto.classroomIds,
          }
        : undefined,
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { classroom: { name: { contains: q, mode: 'insensitive' } } },
          { subject: { name: { contains: q, mode: 'insensitive' } } },
          { curriculum: { name: { contains: q, mode: 'insensitive' } } },
          { teacher: { firstName: { contains: q, mode: 'insensitive' } } },
          { teacher: { lastName: { contains: q, mode: 'insensitive' } } },
          { teacher: { email: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [classroomIntegrations, count] = await Promise.all([
      prisma.classroomIntegration.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: classroomIntegrationInclude,
      }),
      prisma.classroomIntegration.count({
        where,
      }),
    ]);

    return {
      classroomIntegrations,
      pagination: {
        page,
        size,
        count,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async findOneClassroomIntegration(requestedBy: TokenUser, id: string) {
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

    const classroomIntegration = await prisma.classroomIntegration.findUnique({
      where: {
        id,
        classroom: {
          branchId: requestedBy.isSuperAdmin
            ? undefined
            : requestedBy.activeBranchId,
        },
      },
      include: classroomIntegrationIncludeFindOne,
    });

    if (!classroomIntegration) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_INTEGRATION_NOT_FOUND);
    }

    return classroomIntegration;
  }

  async createStudentData(
    requestedBy: TokenUser,
    studentOnClassroom: ClassroomStudentReturnType
  ) {
    const { password: _, ...studentWithoutPassword } =
      studentOnClassroom.student;

    studentWithoutPassword.nationalId = studentWithoutPassword.nationalId
      ? decrypt(studentWithoutPassword.nationalId)
      : null;

    if (studentWithoutPassword.profilePictureUrl) {
      const url = await generateSignedUrl(
        'getObject',
        requestedBy.companyId!,
        requestedBy.activeBranchId,
        'profile-pictures',
        studentWithoutPassword.profilePictureUrl
      );
      studentWithoutPassword.profilePictureUrl = url;
    }

    return {
      ...studentOnClassroom,
      student: studentWithoutPassword,
    };
  }
}
