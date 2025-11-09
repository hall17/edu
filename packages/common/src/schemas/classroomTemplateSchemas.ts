import { z } from 'zod';

import { DayOfWeek } from '../enums';

import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const classroomTemplateScheduleSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z.date(),
  endTime: z.date(),
  isActive: z.boolean(),
});

export const classroomTemplateCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  capacity: z.number().int().min(1).max(1000),
  imageUrl: z.string().max(1000).nullable().optional(),
  attendancePassPercentage: z.number().int().min(0).max(100),
  assessmentScorePass: z.number().int().min(0).max(100),
  assignmentScorePass: z.number().int().min(0).max(100),
  attendanceThreshold: z.number().int().min(0).max(100).nullable().optional(),
  reminderFrequency: z.number().int().nullable().optional(),
  sendNotifications: z.boolean().optional(),
  accessLink: z.string().url().max(255).optional().or(z.literal('')),
  moduleIds: z.array(z.number().int()).optional(),
  schedules: z.array(classroomTemplateScheduleSchema).optional(),
  startDate: z.date(),
  endDate: z.date(),
});

export const classroomTemplateUpdateSchema = classroomTemplateCreateSchema
  .partial()
  .merge(idSchema);

export const classroomTemplateFindAllSchema = z
  .object({
    branchIds: z.array(z.number().int()).optional(),
  })
  .merge(DefaultFilterSchema);

export type ClassroomTemplateScheduleDto = z.infer<
  typeof classroomTemplateScheduleSchema
>;
export type ClassroomTemplateCreateDto = z.infer<
  typeof classroomTemplateCreateSchema
>;
export type ClassroomTemplateUpdateDto = z.infer<
  typeof classroomTemplateUpdateSchema
>;
export type ClassroomTemplateFindAllDto = z.infer<
  typeof classroomTemplateFindAllSchema
>;
