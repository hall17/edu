import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { hasPermission } from '@api/utils';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';
import {
  QuestionCreateDto,
  QuestionUpdateDto,
  QuestionFindAllDto,
} from '../question/questionModel';

import {
  AssessmentCreateDto,
  AssessmentUpdateDto,
  AssessmentFindAllDto,
  AssessmentQuestionCreateDto,
  AssessmentQuestionUpdateDto,
  AssessmentQuestionFindAllDto,
  ClassroomIntegrationAssessmentCreateDto,
  ClassroomIntegrationAssessmentUpdateDto,
  ClassroomIntegrationAssessmentFindAllDto,
  AssessmentLogCreateDto,
  AssessmentLogFindAllDto,
  AssessmentGradingRubricCreateDto,
  AssessmentGradingRubricUpdateDto,
  AssessmentGradingRubricFindAllDto,
  AssessmentNotificationCreateDto,
  AssessmentNotificationFindAllDto,
  AssessmentUpdateStatusDto,
} from './assessmentModel';

@Service()
export class AssessmentService {
  // Assessment CRUD operations
  async findOne(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        subject: true,
        curriculums: true,
        lessons: true,
        questions: {
          include: {
            question: true,
          },
        },
        classroomIntegrationAssessments: {
          include: {
            classroomIntegration: true,
          },
        },
      },
    });

    if (!assessment) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    return assessment;
  }

  async findAll(requestedBy: TokenUser, filterDto: AssessmentFindAllDto) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;
    const page = filterDto.page || 0;
    let orderBy: Prisma.AssessmentOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.AssessmentOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.AssessmentWhereInput = {};

    if (filterDto.subjectIds?.length) {
      where.subjectId = { in: filterDto.subjectIds };
    }

    if (filterDto.curriculumIds?.length) {
      where.curriculums = {
        some: { curriculumId: { in: filterDto.curriculumIds } },
      };
    }

    if (filterDto.lessonIds?.length) {
      where.lessons = { some: { lessonId: { in: filterDto.lessonIds } } };
    }

    if (filterDto.status?.length) {
      where.status = { in: filterDto.status };
    }

    if (filterDto.scheduleType?.length) {
      where.scheduleType = { in: filterDto.scheduleType };
    }

    if (filterDto.scoringType?.length) {
      where.scoringType = { in: filterDto.scoringType };
    }

    if (typeof filterDto.isPublic === 'boolean') {
      where.isPublic = filterDto.isPublic;
    }

    if (q) {
      where = {
        ...where,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { subject: { name: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [assessments, count] = await Promise.all([
      prisma.assessment.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          subject: true,
          curriculums: {
            include: {
              curriculum: true,
            },
          },
          lessons: {
            include: {
              lesson: true,
            },
          },
          _count: {
            select: {
              questions: true,
              classroomIntegrationAssessments: true,
            },
          },
        },
      }),
      prisma.assessment.count({ where }),
    ]);

    return {
      assessments,
      pagination: {
        page,
        size,
        count,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async create(requestedBy: TokenUser, createDto: AssessmentCreateDto) {
    if (!requestedBy.isSuperAdmin) {
      const userHasCreatePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.write
      );

      if (!userHasCreatePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Verify subject exists and user has access
    const subject = await prisma.subject.findUnique({
      where: { id: createDto.subjectId },
      include: { branch: true },
    });

    if (!subject) {
      throw new CustomError(HTTP_EXCEPTIONS.SUBJECT_NOT_FOUND);
    }

    // Check if user has access to the branch
    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.branchIds.includes(subject.branchId)
    ) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the assessment
      const assessment = await tx.assessment.create({
        data: {
          title: createDto.title,
          description: createDto.description,
          scheduleType: createDto.scheduleType,
          duration: createDto.duration,
          maxPoints: createDto.maxPoints,
          isPublic: createDto.isPublic,
          scoringType: createDto.scoringType,
          coverImageUrl: createDto.coverImageUrl,
          sendNotifications: createDto.sendNotifications,
          notificationFrequency: createDto.notificationFrequency,
          subjectId: createDto.subjectId,
          curriculums: {
            createMany: {
              data:
                createDto.curriculumIds?.map((id) => ({ curriculumId: id })) ??
                [],
            },
          },
          lessons: {
            createMany: {
              data: createDto.lessonIds?.map((id) => ({ lessonId: id })) ?? [],
            },
          },
          createdBy: requestedBy.id,
        },
      });

      // Add questions if provided
      if (createDto.questions && createDto.questions.length > 0) {
        const questionsData = createDto.questions.map((q) => ({
          assessmentId: assessment.id,
          questionId: q.questionId,
          order: q.order,
          points: q.points,
        }));

        await tx.assessmentQuestion.createMany({
          data: questionsData,
        });
      }

      // Log the creation
      await tx.assessmentLog.create({
        data: {
          action: 'CREATED',
          assessmentId: assessment.id,
          performedBy: requestedBy.id,
        },
      });

      return assessment;
    });

    return this.findOne(requestedBy, result.id);
  }

  async update(requestedBy: TokenUser, updateDto: AssessmentUpdateDto) {
    if (!requestedBy.isSuperAdmin) {
      const userHasUpdatePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.write
      );

      if (!userHasUpdatePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, questions, ...updateData } = updateDto;

    // Check if assessment exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!existingAssessment) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update the assessment
      const assessment = await tx.assessment.update({
        where: { id },
        data: {
          ...updateData,
          statusUpdatedAt: new Date(),
          statusUpdatedBy: requestedBy.id,
        },
      });

      // Update questions if provided
      if (questions && questions.length > 0) {
        // Remove existing questions
        await tx.assessmentQuestion.deleteMany({
          where: { assessmentId: id },
        });

        // Add new questions
        const questionsData = questions.map((q) => ({
          assessmentId: id,
          questionId: q.questionId,
          order: q.order,
          points: q.points,
        }));

        await tx.assessmentQuestion.createMany({
          data: questionsData,
        });
      }

      // Log the update
      await tx.assessmentLog.create({
        data: {
          action: 'UPDATED',
          assessmentId: id,
          performedBy: requestedBy.id,
        },
      });

      return assessment;
    });

    return this.findOne(requestedBy, result.id);
  }

  async updateStatus(
    requestedBy: TokenUser,
    updateDto: AssessmentUpdateStatusDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasUpdatePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.write
      );

      if (!userHasUpdatePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, status, statusUpdateReason } = updateDto;

    const result = await prisma.assessment.update({
      where: { id },
      data: {
        status,
        statusUpdateReason,
        statusUpdatedAt: new Date(),
        statusUpdatedBy: requestedBy.id,
      },
    });

    return result;
  }

  async deleteAssessment(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasDeletePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.delete
      );

      if (!userHasDeletePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Check if assessment exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!existingAssessment) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    await prisma.$transaction(async (tx) => {
      // Soft delete the assessment
      await tx.assessment.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: requestedBy.id,
        },
      });

      // Log the deletion
      await tx.assessmentLog.create({
        data: {
          action: 'DELETED',
          assessmentId: id,
          performedBy: requestedBy.id,
        },
      });
    });

    return { success: true };
  }

  // AssessmentQuestion CRUD operations
  async findAllAssessmentQuestions(
    requestedBy: TokenUser,
    filterDto: AssessmentQuestionFindAllDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;
    const page = filterDto.page || 0;
    let orderBy: Prisma.AssessmentQuestionOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.AssessmentQuestionOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.order = 'asc';
    }

    let where: Prisma.AssessmentQuestionWhereInput = {};

    if (filterDto.assessmentId) {
      where.assessmentId = filterDto.assessmentId;
    }

    if (filterDto.questionId) {
      where.questionId = filterDto.questionId;
    }

    if (q) {
      where = {
        ...where,
        OR: [
          { assessment: { title: { contains: q, mode: 'insensitive' } } },
          { question: { questionText: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [assessmentQuestions, count] = await Promise.all([
      prisma.assessmentQuestion.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          assessment: {
            select: {
              id: true,
              title: true,
            },
          },
          question: true,
        },
      }),
      prisma.assessmentQuestion.count({ where }),
    ]);

    return {
      data: assessmentQuestions,
      pagination: {
        page,
        size,
        total: count,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async createAssessmentQuestion(
    requestedBy: TokenUser,
    createDto: AssessmentQuestionCreateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasCreatePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.write
      );

      if (!userHasCreatePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const result = await prisma.assessmentQuestion.create({
      data: createDto,
    });

    return result;
  }

  async updateAssessmentQuestion(
    requestedBy: TokenUser,
    updateDto: AssessmentQuestionUpdateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasUpdatePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.write
      );

      if (!userHasUpdatePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, ...updateData } = updateDto;

    const result = await prisma.assessmentQuestion.update({
      where: { id },
      data: updateData,
    });

    return result;
  }

  async deleteAssessmentQuestion(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasDeletePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.delete
      );

      if (!userHasDeletePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    await prisma.assessmentQuestion.delete({
      where: { id },
    });

    return { success: true };
  }

  // ClassroomIntegrationAssessment CRUD operations
  async findAllClassroomIntegrationAssessments(
    requestedBy: TokenUser,
    filterDto: ClassroomIntegrationAssessmentFindAllDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;
    const page = filterDto.page || 0;
    let orderBy: Prisma.ClassroomIntegrationAssessmentOrderByWithRelationInput =
      {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.ClassroomIntegrationAssessmentOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.createdAt = 'desc';
    }

    let where: Prisma.ClassroomIntegrationAssessmentWhereInput = {};

    if (filterDto.classroomIntegrationId) {
      where.classroomIntegrationId = filterDto.classroomIntegrationId;
    }

    if (filterDto.assessmentId) {
      where.assessmentId = filterDto.assessmentId;
    }

    if (q) {
      where = {
        ...where,
        OR: [
          {
            classroomIntegration: {
              classroom: { name: { contains: q, mode: 'insensitive' } },
            },
          },
          { assessment: { title: { contains: q, mode: 'insensitive' } } },
        ],
      };
    }

    const [classroomIntegrationAssessments, count] = await Promise.all([
      prisma.classroomIntegrationAssessment.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: {
          classroomIntegration: {
            include: {
              classroom: true,
              subject: true,
            },
          },
          assessment: true,
        },
      }),
      prisma.classroomIntegrationAssessment.count({ where }),
    ]);

    return {
      data: classroomIntegrationAssessments,
      pagination: {
        page,
        size,
        total: count,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async createClassroomIntegrationAssessment(
    requestedBy: TokenUser,
    createDto: ClassroomIntegrationAssessmentCreateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasCreatePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.write
      );

      if (!userHasCreatePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // Verify classroom integration exists and user has access
    const classroomIntegration = await prisma.classroomIntegration.findUnique({
      where: { id: createDto.classroomIntegrationId },
      include: { classroom: { include: { branch: true } } },
    });

    if (!classroomIntegration) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_INTEGRATION_NOT_FOUND);
    }

    // Check if user has access to the branch
    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.branchIds.includes(classroomIntegration.classroom.branchId)
    ) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    // Verify assessment exists
    const assessment = await prisma.assessment.findUnique({
      where: { id: createDto.assessmentId },
    });

    if (!assessment) {
      throw new CustomError(HTTP_EXCEPTIONS.ASSESSMENT_NOT_FOUND);
    }

    const result = await prisma.classroomIntegrationAssessment.create({
      data: createDto,
    });

    return result;
  }

  async updateClassroomIntegrationAssessment(
    requestedBy: TokenUser,
    updateDto: ClassroomIntegrationAssessmentUpdateDto
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasUpdatePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.write
      );

      if (!userHasUpdatePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, ...updateData } = updateDto;

    const result = await prisma.classroomIntegrationAssessment.update({
      where: { id },
      data: updateData,
    });

    return result;
  }

  async deleteClassroomIntegrationAssessment(
    requestedBy: TokenUser,
    id: string
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasDeletePermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.delete
      );

      if (!userHasDeletePermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    await prisma.classroomIntegrationAssessment.delete({
      where: { id },
    });

    return { success: true };
  }

  // Additional utility methods
  async findOneAssessmentQuestion(requestedBy: TokenUser, id: string) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const assessmentQuestion = await prisma.assessmentQuestion.findUnique({
      where: { id },
      include: {
        assessment: {
          select: {
            id: true,
            title: true,
          },
        },
        question: true,
      },
    });

    if (!assessmentQuestion) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    return assessmentQuestion;
  }

  async findOneClassroomIntegrationAssessment(
    requestedBy: TokenUser,
    id: string
  ) {
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const classroomIntegrationAssessment =
      await prisma.classroomIntegrationAssessment.findUnique({
        where: { id },
        include: {
          classroomIntegration: {
            include: {
              classroom: true,
              subject: true,
            },
          },
          assessment: true,
        },
      });

    if (!classroomIntegrationAssessment) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    return classroomIntegrationAssessment;
  }
}
