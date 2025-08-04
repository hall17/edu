import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';
import { idSchema } from '../../types';
import {
  questionCreateSchema,
  questionFindAllSchema,
  questionUpdateSchema,
} from '../question/questionModel';

import {
  assessmentCreateSchema,
  assessmentFindAllSchema,
  assessmentUpdateSchema,
  assessmentQuestionCreateSchema,
  assessmentQuestionFindAllSchema,
  assessmentQuestionUpdateSchema,
  classroomIntegrationAssessmentCreateSchema,
  classroomIntegrationAssessmentFindAllSchema,
  classroomIntegrationAssessmentUpdateSchema,
  assessmentLogCreateSchema,
  assessmentLogFindAllSchema,
  assessmentGradingRubricCreateSchema,
  assessmentGradingRubricFindAllSchema,
  assessmentGradingRubricUpdateSchema,
  assessmentNotificationCreateSchema,
  assessmentNotificationFindAllSchema,
  assessmentUpdateStatusSchema,
} from './assessmentModel';
import { AssessmentService } from './assessmentService';

const assessmentService = Container.get(AssessmentService);

export const assessmentRouter = t.router({
  // Assessment procedures
  findOne: protectedProcedure.input(idSchema).query(async ({ ctx, input }) => {
    return assessmentService.findOne(ctx.req.user, input.id);
  }),

  findAll: protectedProcedure
    .input(assessmentFindAllSchema)
    .query(async ({ ctx, input }) => {
      return assessmentService.findAll(ctx.req.user, input);
    }),

  create: protectedProcedure
    .input(assessmentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.create(ctx.req.user, input);
    }),

  update: protectedProcedure
    .input(assessmentUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.update(ctx.req.user, input);
    }),

  updateStatus: protectedProcedure
    .input(assessmentUpdateStatusSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.updateStatus(ctx.req.user, input);
    }),

  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.deleteAssessment(ctx.req.user, input.id);
    }),

  // AssessmentQuestion procedures
  findOneAssessmentQuestion: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      return assessmentService.findOneAssessmentQuestion(
        ctx.req.user,
        input.id
      );
    }),

  findAllAssessmentQuestions: protectedProcedure
    .input(assessmentQuestionFindAllSchema)
    .query(async ({ ctx, input }) => {
      return assessmentService.findAllAssessmentQuestions(ctx.req.user, input);
    }),

  createAssessmentQuestion: protectedProcedure
    .input(assessmentQuestionCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.createAssessmentQuestion(ctx.req.user, input);
    }),

  updateAssessmentQuestion: protectedProcedure
    .input(assessmentQuestionUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.updateAssessmentQuestion(ctx.req.user, input);
    }),

  deleteAssessmentQuestion: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.deleteAssessmentQuestion(ctx.req.user, input.id);
    }),

  // ClassroomIntegrationAssessment procedures
  findOneClassroomIntegrationAssessment: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      return assessmentService.findOneClassroomIntegrationAssessment(
        ctx.req.user,
        input.id
      );
    }),

  findAllClassroomIntegrationAssessments: protectedProcedure
    .input(classroomIntegrationAssessmentFindAllSchema)
    .query(async ({ ctx, input }) => {
      return assessmentService.findAllClassroomIntegrationAssessments(
        ctx.req.user,
        input
      );
    }),

  createClassroomIntegrationAssessment: protectedProcedure
    .input(classroomIntegrationAssessmentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.createClassroomIntegrationAssessment(
        ctx.req.user,
        input
      );
    }),

  updateClassroomIntegrationAssessment: protectedProcedure
    .input(classroomIntegrationAssessmentUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.updateClassroomIntegrationAssessment(
        ctx.req.user,
        input
      );
    }),

  deleteClassroomIntegrationAssessment: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return assessmentService.deleteClassroomIntegrationAssessment(
        ctx.req.user,
        input.id
      );
    }),

  // Question procedures (for reference)
  findAllQuestions: protectedProcedure
    .input(questionFindAllSchema)
    .query(async ({ ctx, input }) => {
      // This would need a QuestionService to be implemented
      // For now, we'll return a placeholder
      return {
        data: [],
        pagination: { page: 1, size: 10, total: 0, totalPages: 0 },
      };
    }),

  createQuestion: protectedProcedure
    .input(questionCreateSchema)
    .mutation(async ({ ctx, input }) => {
      // This would need a QuestionService to be implemented
      // For now, we'll return a placeholder
      return { success: true };
    }),

  updateQuestion: protectedProcedure
    .input(questionUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      // This would need a QuestionService to be implemented
      // For now, we'll return a placeholder
      return { success: true };
    }),

  // AssessmentLog procedures
  findAllAssessmentLogs: protectedProcedure
    .input(assessmentLogFindAllSchema)
    .query(async ({ ctx, input }) => {
      // This would need an AssessmentLogService to be implemented
      // For now, we'll return a placeholder
      return {
        data: [],
        pagination: { page: 1, size: 10, total: 0, totalPages: 0 },
      };
    }),

  createAssessmentLog: protectedProcedure
    .input(assessmentLogCreateSchema)
    .mutation(async ({ ctx, input }) => {
      // This would need an AssessmentLogService to be implemented
      // For now, we'll return a placeholder
      return { success: true };
    }),

  // AssessmentGradingRubric procedures
  findAllAssessmentGradingRubrics: protectedProcedure
    .input(assessmentGradingRubricFindAllSchema)
    .query(async ({ ctx, input }) => {
      // This would need an AssessmentGradingRubricService to be implemented
      // For now, we'll return a placeholder
      return {
        data: [],
        pagination: { page: 1, size: 10, total: 0, totalPages: 0 },
      };
    }),

  createAssessmentGradingRubric: protectedProcedure
    .input(assessmentGradingRubricCreateSchema)
    .mutation(async ({ ctx, input }) => {
      // This would need an AssessmentGradingRubricService to be implemented
      // For now, we'll return a placeholder
      return { success: true };
    }),

  updateAssessmentGradingRubric: protectedProcedure
    .input(assessmentGradingRubricUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      // This would need an AssessmentGradingRubricService to be implemented
      // For now, we'll return a placeholder
      return { success: true };
    }),

  // AssessmentNotification procedures
  findAllAssessmentNotifications: protectedProcedure
    .input(assessmentNotificationFindAllSchema)
    .query(async ({ ctx, input }) => {
      // This would need an AssessmentNotificationService to be implemented
      // For now, we'll return a placeholder
      return {
        data: [],
        pagination: { page: 1, size: 10, total: 0, totalPages: 0 },
      };
    }),

  createAssessmentNotification: protectedProcedure
    .input(assessmentNotificationCreateSchema)
    .mutation(async ({ ctx, input }) => {
      // This would need an AssessmentNotificationService to be implemented
      // For now, we'll return a placeholder
      return { success: true };
    }),
});
