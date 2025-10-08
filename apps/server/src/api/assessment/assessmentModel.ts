import {
  AssessmentStatus,
  ScheduleType,
  ScoringType,
  AssessmentLogAction,
  AssessmentNotificationType,
  NotificationStatus,
} from '@api/prisma/generated/prisma/client';
import { z } from 'zod';

import { DefaultFilterSchema, idSchema } from '../../types';

// Assessment schemas
export const assessmentCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  scheduleType: z.nativeEnum(ScheduleType),
  duration: z.number().int().positive().optional(),
  maxPoints: z.number().int().min(1).max(1000),
  isPublic: z.boolean(),
  scoringType: z.nativeEnum(ScoringType),
  coverImageUrl: z.string().optional(),
  sendNotifications: z.boolean(),
  notificationFrequency: z.number().int().positive().optional(),
  subjectId: z.string().uuid(),
  curriculumId: z.string().uuid().optional(),
  lessonId: z.string().uuid().optional(),
  questions: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        order: z.number().int().min(1),
        points: z.number().int().min(1),
      })
    )
    .optional(),
});

export const assessmentUpdateSchema = z
  .object({})
  .merge(assessmentCreateSchema)
  .partial()
  .merge(idSchema);

export const assessmentFindAllSchema = z
  .object({
    subjectId: z.string().uuid().optional(),
    curriculumId: z.string().uuid().optional(),
    lessonId: z.string().uuid().optional(),
    status: z.array(z.nativeEnum(AssessmentStatus)).optional(),
    scheduleType: z.array(z.nativeEnum(ScheduleType)).optional(),
    scoringType: z.array(z.nativeEnum(ScoringType)).optional(),
    isPublic: z.boolean().optional(),
  })
  .merge(DefaultFilterSchema);

// AssessmentQuestion schemas
export const assessmentQuestionCreateSchema = z.object({
  assessmentId: z.string().uuid(),
  questionId: z.string().uuid(),
  order: z.number().int().min(1),
  points: z.number().int().min(1),
});

export const assessmentQuestionUpdateSchema = z
  .object({})
  .merge(assessmentQuestionCreateSchema)
  .partial()
  .merge(idSchema);

export const assessmentQuestionFindAllSchema = z
  .object({
    assessmentId: z.string().uuid().optional(),
    questionId: z.string().uuid().optional(),
  })
  .merge(DefaultFilterSchema);

// ClassroomIntegrationAssessment schemas
export const classroomIntegrationAssessmentCreateSchema = z.object({
  classroomIntegrationId: z.string().uuid(),
  assessmentId: z.string().uuid(),
  startDate: z.string().transform((stringDate) => new Date(stringDate)),
  endDate: z.string().transform((stringDate) => new Date(stringDate)),
});

export const classroomIntegrationAssessmentUpdateSchema = z
  .object({})
  .merge(classroomIntegrationAssessmentCreateSchema)
  .partial()
  .merge(idSchema);

export const classroomIntegrationAssessmentFindAllSchema = z
  .object({
    classroomIntegrationId: z.string().uuid().optional(),
    assessmentId: z.string().uuid().optional(),
  })
  .merge(DefaultFilterSchema);

// Question schemas are imported from questionModel

// AssessmentLog schemas
export const assessmentLogCreateSchema = z.object({
  action: z.nativeEnum(AssessmentLogAction),
  notes: z.string().optional(),
  assessmentId: z.string().uuid(),
});

export const assessmentUpdateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(AssessmentStatus),
  statusUpdateReason: z.string().optional(),
});

export const assessmentLogFindAllSchema = z
  .object({
    assessmentId: z.string().uuid().optional(),
    action: z.array(z.nativeEnum(AssessmentLogAction)).optional(),
  })
  .merge(DefaultFilterSchema);

// AssessmentGradingRubric schemas
export const assessmentGradingRubricCreateSchema = z.object({
  criterion: z.string().min(1).max(200),
  minPoints: z.number().int().min(0),
  maxPoints: z.number().int().min(1),
  assessmentId: z.string().uuid(),
});

export const assessmentGradingRubricUpdateSchema = z
  .object({})
  .merge(assessmentGradingRubricCreateSchema)
  .partial()
  .merge(idSchema);

export const assessmentGradingRubricFindAllSchema = z
  .object({
    assessmentId: z.string().uuid().optional(),
  })
  .merge(DefaultFilterSchema);

// AssessmentNotification schemas
export const assessmentNotificationCreateSchema = z.object({
  type: z.nativeEnum(AssessmentNotificationType),
  message: z.string().min(1),
  assessmentId: z.string().uuid(),
  studentId: z.string().uuid(),
  branchId: z.number().int().optional(),
});

export const assessmentNotificationFindAllSchema = z
  .object({
    assessmentId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional(),
    type: z.array(z.nativeEnum(AssessmentNotificationType)).optional(),
    status: z.array(z.nativeEnum(NotificationStatus)).optional(),
    branchId: z.number().int().optional(),
  })
  .merge(DefaultFilterSchema);

// Export types
export type AssessmentCreateDto = z.infer<typeof assessmentCreateSchema>;
export type AssessmentUpdateDto = z.infer<typeof assessmentUpdateSchema>;
export type AssessmentFindAllDto = z.infer<typeof assessmentFindAllSchema>;
export type AssessmentUpdateStatusDto = z.infer<
  typeof assessmentUpdateStatusSchema
>;

export type AssessmentQuestionCreateDto = z.infer<
  typeof assessmentQuestionCreateSchema
>;
export type AssessmentQuestionUpdateDto = z.infer<
  typeof assessmentQuestionUpdateSchema
>;
export type AssessmentQuestionFindAllDto = z.infer<
  typeof assessmentQuestionFindAllSchema
>;

export type ClassroomIntegrationAssessmentCreateDto = z.infer<
  typeof classroomIntegrationAssessmentCreateSchema
>;
export type ClassroomIntegrationAssessmentUpdateDto = z.infer<
  typeof classroomIntegrationAssessmentUpdateSchema
>;
export type ClassroomIntegrationAssessmentFindAllDto = z.infer<
  typeof classroomIntegrationAssessmentFindAllSchema
>;

// Question types are imported from questionModel

export type AssessmentLogCreateDto = z.infer<typeof assessmentLogCreateSchema>;
export type AssessmentLogFindAllDto = z.infer<
  typeof assessmentLogFindAllSchema
>;

export type AssessmentGradingRubricCreateDto = z.infer<
  typeof assessmentGradingRubricCreateSchema
>;
export type AssessmentGradingRubricUpdateDto = z.infer<
  typeof assessmentGradingRubricUpdateSchema
>;
export type AssessmentGradingRubricFindAllDto = z.infer<
  typeof assessmentGradingRubricFindAllSchema
>;

export type AssessmentNotificationCreateDto = z.infer<
  typeof assessmentNotificationCreateSchema
>;
export type AssessmentNotificationFindAllDto = z.infer<
  typeof assessmentNotificationFindAllSchema
>;
