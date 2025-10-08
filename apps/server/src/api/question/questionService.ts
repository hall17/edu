import { HTTP_EXCEPTIONS } from '@api/constants';
import { getQuestionInclude } from '@api/libs/prisma/selections';
import { CustomError, TokenUser } from '@api/types';
import { hasPermission } from '@api/utils/hasPermission';
import {
  MODULE_CODES,
  PERMISSIONS,
  QuestionData,
  SYSTEM_ROLES,
} from '@edusama/common';
import { Prisma } from '@api/prisma/generated/prisma/client';
import { Service } from 'typedi';

import { prisma } from '@api/libs/prisma';
import { PAGE_SIZE } from '../../utils/constants';

import {
  QuestionCreateDto,
  QuestionFindAllDto,
  QuestionFindQuestionsRandomDto,
  QuestionUpdateDto,
} from './questionModel';

@Service()
export class QuestionService {
  async findMetadata(requestedBy: TokenUser) {
    const isAssessmentModuleManager = requestedBy.roles.some(
      (role) =>
        role.code === SYSTEM_ROLES.moduleManager &&
        role.module?.code === MODULE_CODES.assessment
    );

    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.isAdmin &&
      !isAssessmentModuleManager
    ) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const questions = await prisma.question.findMany({
      select: {
        id: true,
        type: true,
        difficulty: true,
        _count: {
          select: {
            assessmentQuestions: true,
          },
        },
      },
    });

    return questions;
  }

  async findAll(requestedBy: TokenUser, filterDto: QuestionFindAllDto) {
    // Apply permission-based access control
    const isAssessmentModuleManager = requestedBy.roles.some(
      (role) =>
        role.code === SYSTEM_ROLES.moduleManager &&
        role.module?.code === MODULE_CODES.assessment
    );

    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.isAdmin &&
      !isAssessmentModuleManager
    ) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    // if (!requestedBy.isSuperAdmin) {
    //   const userHasReadPermission = hasPermission(
    //     requestedBy,
    //     MODULE_CODES.assessment,
    //     PERMISSIONS.read
    //   );

    //   if (!userHasReadPermission) {
    //     throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    //   }
    // }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 0;
    let orderBy: Prisma.QuestionOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = { [field]: order as Prisma.SortOrder };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.QuestionWhereInput = {
      subject: {
        branchId: requestedBy.activeBranchId,
      },
    };

    if (filterDto.type && filterDto.type.length > 0) {
      where = {
        ...where,
        type: {
          in: filterDto.type,
        },
      };
    }

    if (filterDto.difficulty && filterDto.difficulty.length > 0) {
      where = {
        ...where,
        difficulty: {
          in: filterDto.difficulty,
        },
      };
    }

    if (filterDto.subjectIds) {
      where = {
        ...where,
        subjectId: {
          in: filterDto.subjectIds,
        },
      };
    }

    if (filterDto.curriculumIds) {
      where = {
        ...where,
        curriculumId: {
          in: filterDto.curriculumIds,
        },
      };
    }

    if (filterDto.lessonIds) {
      where = {
        ...where,
        lessonId: {
          in: filterDto.lessonIds,
        },
      };
    }

    if (q) {
      where.questionText = { contains: q, mode: 'insensitive' };
    }

    const [questions, count] = await Promise.all([
      prisma.question.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: getQuestionInclude(filterDto.type),
      }),
      prisma.question.count({
        where,
      }),
    ]);

    return {
      questions: questions.map((question) => ({
        ...question,
        questionData: question.questionData as QuestionData,
      })),
      count,
    };
  }

  async findQuestionsRandom(
    requestedBy: TokenUser,
    filterDto: QuestionFindQuestionsRandomDto
  ) {
    // Apply permission-based access control
    const isAssessmentModuleManager = requestedBy.roles.some(
      (role) =>
        role.code === SYSTEM_ROLES.moduleManager &&
        role.module?.code === MODULE_CODES.assessment
    );

    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.isAdmin &&
      !isAssessmentModuleManager
    ) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { type, difficulty, subjectId, curriculumId, lessonIds, count } =
      filterDto;

    const questionIds = await prisma.question.findMany({
      where: {
        type,
        difficulty,
        subjectId,
        curriculumId,
        lessonId: { in: lessonIds },
      },
      select: {
        id: true,
      },
    });

    if (questionIds.length < count) {
      throw new CustomError(HTTP_EXCEPTIONS.QUESTION_NOT_ENOUGH);
    }

    const randomizedQuestionIds = questionIds
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    const randomIds = randomizedQuestionIds
      .slice(0, count)
      .map((question) => question.id);

    const questions = await prisma.question.findMany({
      where: {
        id: { in: randomIds },
      },
      include: {
        curriculum: true,
        lesson: true,
        subject: true,
        responses: true,
      },
    });

    return questions;
  }

  async findOne(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    const isAssessmentModuleManager = requestedBy.roles.some(
      (role) =>
        role.code === SYSTEM_ROLES.moduleManager &&
        role.module?.code === MODULE_CODES.assessment
    );

    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.isAdmin &&
      !isAssessmentModuleManager
    ) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const question = await prisma.question.findUnique({
      where: {
        id,
        lesson: {
          curriculum: {
            subject: {
              branchId: requestedBy.isSuperAdmin
                ? undefined
                : requestedBy.activeBranchId,
            },
          },
        },
      },
      include: getQuestionInclude(),
    });

    if (!question) {
      throw new CustomError(HTTP_EXCEPTIONS.QUESTION_NOT_FOUND);
    }

    return { ...question, questionData: question.questionData as QuestionData };
  }

  async create(requestedBy: TokenUser, dto: QuestionCreateDto) {
    const isAssessmentModuleManager = requestedBy.roles.some(
      (role) =>
        role.code === SYSTEM_ROLES.moduleManager &&
        role.module?.code === MODULE_CODES.assessment
    );

    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.isAdmin &&
      !isAssessmentModuleManager
    ) {
      const userHasPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.write
      );

      if (!userHasPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }
    // Check if user has permission to write questions
    // if (!requestedBy.isSuperAdmin) {
    //   const userHasPermission = hasPermission(
    //     requestedBy,
    //     MODULE_CODES.assessment,
    //     PERMISSIONS.write
    //   );

    //   if (!userHasPermission) {
    //     throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    //   }
    // }

    // Verify the subject belongs to the user's active branch
    const subject = await prisma.subject.findUnique({
      where: {
        id: dto.subjectId,
        branchId: requestedBy.activeBranchId,
      },
    });

    if (!subject) {
      throw new CustomError(HTTP_EXCEPTIONS.SUBJECT_NOT_FOUND);
    }

    // If curriculumId is provided, verify it belongs to the subject
    if (dto.curriculumId) {
      const curriculum = await prisma.curriculum.findUnique({
        where: {
          id: dto.curriculumId,
          subjectId: dto.subjectId,
        },
      });

      if (!curriculum) {
        throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_NOT_FOUND);
      }
    }

    // If lessonId is provided, verify it belongs to the curriculum/subject
    if (dto.lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: dto.lessonId,
          curriculumId: dto.curriculumId,
        },
      });

      if (!lesson) {
        throw new CustomError(HTTP_EXCEPTIONS.LESSON_NOT_FOUND);
      }
    }

    // Check if question with same text already exists in the subject/curriculum/lesson
    const existingQuestion = await prisma.question.findFirst({
      where: {
        subjectId: dto.subjectId,
        curriculumId: dto.curriculumId,
        lessonId: dto.lessonId,
        questionText: dto.questionText,
      },
    });

    if (existingQuestion) {
      throw new CustomError(HTTP_EXCEPTIONS.QUESTION_ALREADY_EXISTS);
    }

    const question = await prisma.question.create({
      data: {
        ...dto,
      },
      include: getQuestionInclude(),
    });

    return { ...question, questionData: question.questionData as QuestionData };
  }

  async update(requestedBy: TokenUser, dto: QuestionUpdateDto) {
    // Check if user has permission to write questions
    const isAssessmentModuleManager = requestedBy.roles.some(
      (role) =>
        role.code === SYSTEM_ROLES.moduleManager &&
        role.module?.code === MODULE_CODES.assessment
    );

    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.isAdmin &&
      !isAssessmentModuleManager
    ) {
      const userHasPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.write
      );

      if (!userHasPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { id, ...updateData } = dto;

    const existingQuestion = await prisma.question.findUnique({
      where: {
        id,
        lesson: {
          curriculum: {
            subject: {
              branchId: requestedBy.isSuperAdmin
                ? undefined
                : requestedBy.activeBranchId,
            },
          },
        },
      },
      include: getQuestionInclude(),
    });

    if (!existingQuestion) {
      throw new CustomError(HTTP_EXCEPTIONS.QUESTION_NOT_FOUND);
    }

    // Validate related entities if they're being updated
    if (updateData.subjectId) {
      const subject = await prisma.subject.findUnique({
        where: {
          id: updateData.subjectId,
          branchId: requestedBy.activeBranchId,
        },
      });

      if (!subject) {
        throw new CustomError(HTTP_EXCEPTIONS.SUBJECT_NOT_FOUND);
      }
    }

    if (updateData.curriculumId) {
      const curriculum = await prisma.curriculum.findUnique({
        where: {
          id: updateData.curriculumId,
          subjectId: updateData.subjectId || existingQuestion.subjectId,
        },
      });

      if (!curriculum) {
        throw new CustomError(HTTP_EXCEPTIONS.CURRICULUM_NOT_FOUND);
      }
    }

    if (updateData.lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: updateData.lessonId,
        },
      });

      if (!lesson) {
        throw new CustomError(HTTP_EXCEPTIONS.LESSON_NOT_FOUND);
      }
    }

    // Check if question with same text already exists in the subject/curriculum/lesson (excluding current question)
    if (updateData.questionText) {
      const existingQuestionWithText = await prisma.question.findFirst({
        where: {
          subjectId: updateData.subjectId || existingQuestion.subjectId,
          curriculumId:
            updateData.curriculumId || existingQuestion.curriculumId,
          lessonId: updateData.lessonId || existingQuestion.lessonId,
          questionText: updateData.questionText,
          id: { not: id },
        },
      });

      if (existingQuestionWithText) {
        throw new CustomError(HTTP_EXCEPTIONS.QUESTION_ALREADY_EXISTS);
      }
    }

    const question = await prisma.question.update({
      where: { id },
      data: updateData,
      include: getQuestionInclude(),
    });

    return { ...question, questionData: question.questionData as QuestionData };
  }

  async delete(requestedBy: TokenUser, id: string) {
    // Check if user has permission to delete questions
    const isAssessmentModuleManager = requestedBy.roles.some(
      (role) =>
        role.code === SYSTEM_ROLES.moduleManager &&
        role.module?.code === MODULE_CODES.assessment
    );

    if (
      !requestedBy.isSuperAdmin &&
      !requestedBy.isAdmin &&
      !isAssessmentModuleManager
    ) {
      const userHasPermission = hasPermission(
        requestedBy,
        MODULE_CODES.assessment,
        PERMISSIONS.delete
      );

      if (!userHasPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const question = await prisma.question.findUnique({
      where: {
        id,
        lesson: {
          curriculum: {
            subject: {
              branchId: requestedBy.isSuperAdmin
                ? undefined
                : requestedBy.activeBranchId,
            },
          },
        },
      },
      include: {
        responses: true,
        lesson: {
          include: {
            curriculum: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });

    if (!question) {
      throw new CustomError(HTTP_EXCEPTIONS.QUESTION_NOT_FOUND);
    }

    // Prevent deleting questions that have responses
    if (question.responses.length > 0) {
      throw new CustomError(HTTP_EXCEPTIONS.QUESTION_HAS_RESPONSES);
    }

    await prisma.question.delete({
      where: { id },
    });

    return { success: true };
  }
}
