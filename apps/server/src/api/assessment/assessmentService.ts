import { HTTP_EXCEPTIONS } from '@api/constants';
import { prisma } from '@api/libs/prisma';
import { deleteS3Object, generateSignedUrl } from '@api/libs/s3';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { hasPermission } from '@api/utils';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
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
  AssessmentUpdateStatusDto,
} from '@edusama/common';
import { Service } from 'typedi';

import { PAGE_SIZE } from '../../utils/constants';

const assessmentInclude = {
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
} satisfies Prisma.AssessmentInclude;

@Service()
export class AssessmentService {
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
    const page = filterDto.page || 1;
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
        include: assessmentInclude,
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
      include: assessmentInclude,
    });

    if (!assessment) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    return assessment;
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

    const id = crypto.randomUUID();

    if (createDto.coverImageUrl) {
      createDto.coverImageUrl = id;
    }

    const createdAssessment = await prisma.$transaction(async (tx) => {
      // Create the assessment
      const assessment = await tx.assessment.create({
        data: {
          id,
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
          rubrics: {
            createMany: {
              data:
                createDto.rubrics?.map((r) => ({
                  criterion: r.criterion,
                  minPoints: r.minPoints,
                  maxPoints: r.maxPoints,
                })) ?? [],
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

    const assessment = await this.findOne(requestedBy, createdAssessment.id);

    if (createdAssessment.coverImageUrl) {
      const signedAwsS3Url = await generateSignedUrl({
        operation: 'putObject',
        companyId: requestedBy.companyId!,
        branchId: requestedBy.activeBranchId,
        folder: 'assessments',
        key: createdAssessment.coverImageUrl,
      });

      return {
        ...assessment,
        signedAwsS3Url,
      };
    }

    return assessment;
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

    // Check if assessment exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id: updateDto.id },
      include: {
        rubrics: true,
        questions: true,
      },
    });

    const { id, questions, rubrics, ...updateData } = updateDto;

    if (!existingAssessment) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    if (updateData.coverImageUrl) {
      updateData.coverImageUrl = id;
    } else if (updateData.coverImageUrl === null) {
      // delete the cover image from s3
      deleteS3Object(
        requestedBy.companyId!,
        requestedBy.activeBranchId,
        'assessments',
        existingAssessment.id
      );
    }

    const updatedAssessment = await prisma.$transaction(async (tx) => {
      // Update the assessment
      const assessment = await tx.assessment.update({
        where: { id },
        data: updateData,
      });

      // Update questions if provided
      if (questions && questions.length > 0) {
        const existingQuestionIds = existingAssessment.questions.map(
          (q) => q.id
        );
        const newQuestionIds = questions.map((q) => q.questionId);
        const questionsToDelete = existingQuestionIds.filter(
          (id) => !newQuestionIds.includes(id)
        );
        const questionsToCreate = questions.filter((q) => !q.questionId);
        const questionsToUpdate = questions.filter(
          (q) => q.questionId && existingQuestionIds.includes(q.questionId)
        );

        // Delete existing questions
        await tx.assessmentQuestion.deleteMany({
          where: { id: { in: questionsToDelete } },
        });

        // Create new questions
        await tx.assessmentQuestion.createMany({
          data: questionsToCreate.map((q) => ({
            assessmentId: existingAssessment.id,
            questionId: q.questionId,
            order: q.order,
            points: q.points,
          })),
        });

        // Update existing questions
        for (const q of questionsToUpdate) {
          await tx.assessmentQuestion.update({
            where: { id: q.questionId },
            data: {
              order: q.order,
              points: q.points,
            },
          });
        }
      }

      // Update rubrics if provided
      if (rubrics && rubrics.length > 0) {
        const existingRubricIds = existingAssessment.rubrics.map((r) => r.id);
        const newRubricIds = rubrics.map((r) => r.id);
        const rubricsToDelete = existingRubricIds.filter(
          (id) => !newRubricIds.includes(id)
        );
        const rubricsToCreate = rubrics.filter((r) => !r.id);
        const rubricsToUpdate = rubrics.filter(
          (r) => r.id && existingRubricIds.includes(r.id)
        );

        // Remove existing rubrics
        await tx.assessmentGradingRubric.deleteMany({
          where: { id: { in: rubricsToDelete } },
        });

        // Create new rubrics
        await tx.assessmentGradingRubric.createMany({
          data: rubricsToCreate.map((r) => ({
            assessmentId: existingAssessment.id,
            criterion: r.criterion,
            minPoints: r.minPoints,
            maxPoints: r.maxPoints,
          })),
        });

        // Update existing rubrics
        for (const r of rubricsToUpdate) {
          await tx.assessmentGradingRubric.update({
            where: { id: r.id },
            data: {
              criterion: r.criterion,
              minPoints: r.minPoints,
              maxPoints: r.maxPoints,
            },
          });
        }
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

    const assessment = await this.findOne(requestedBy, updatedAssessment.id);

    if (updatedAssessment.coverImageUrl) {
      const signedAwsS3Url = await generateSignedUrl({
        operation: 'putObject',
        companyId: requestedBy.companyId!,
        branchId: requestedBy.activeBranchId,
        folder: 'assessments',
        key: updatedAssessment.coverImageUrl,
      });

      return {
        ...assessment,
        signedAwsS3Url,
      };
    }

    return assessment;
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
      include: assessmentInclude,
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
    const page = filterDto.page || 1;
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
    const page = filterDto.page || 1;
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
      where: {
        id: createDto.classroomIntegrationId,
        classroom: { branchId: requestedBy.activeBranchId },
      },
      include: { classroom: { include: { students: true } } },
    });

    if (!classroomIntegration) {
      throw new CustomError(HTTP_EXCEPTIONS.CLASSROOM_INTEGRATION_NOT_FOUND);
    }

    // Verify assessment exists
    const assessment = await prisma.assessment.findUnique({
      where: { id: createDto.assessmentId },
    });

    if (!assessment) {
      throw new CustomError(HTTP_EXCEPTIONS.ASSESSMENT_NOT_FOUND);
    }

    const classroomIntegrationAssessment =
      await prisma.classroomIntegrationAssessment.create({
        data: {
          ...createDto,
          studentAssessments: {
            createMany: {
              data: classroomIntegration.classroom.students.map((student) => ({
                studentId: student.studentId,
                status: 'PENDING',
              })),
            },
          },
        },
      });

    return classroomIntegrationAssessment;
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

    await prisma.$transaction(
      async (tx) => {
        await tx.classroomIntegrationAssessment.update({
          where: { id },
          data: {
            deletedAt: new Date(),
            deletedBy: requestedBy.id,
          },
        });
        await tx.studentClassroomIntegrationAssessment.updateMany({
          where: { classroomIntegrationAssessmentId: id },
          data: {
            deletedAt: new Date(),
          },
        });
      },
      { timeout: 30000 }
    );

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
}
