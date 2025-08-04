import { DayOfWeek } from '@prisma/client';
import { z } from 'zod';

import { DefaultFilterSchema, idSchema } from '../../types';

export const classroomTemplateScheduleSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z.string().transform((stringDate) => new Date(stringDate)),
  endTime: z.string().transform((stringDate) => new Date(stringDate)),
  isActive: z.boolean().default(true),
});

export const classroomTemplateCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  capacity: z.number().int().min(1).max(1000),
  imageUrl: z.string().url().max(255).optional(),
  attendancePassPercentage: z.number().int().min(0).max(100).default(80),
  assessmentScorePass: z.number().int().min(0).max(100).default(80),
  assignmentScorePass: z.number().int().min(0).max(100).default(80),
  attendanceThreshold: z.number().int().min(0).max(100).optional(),
  reminderFrequency: z.number().int().optional(),
  sendNotifications: z.boolean().optional(),
  accessLink: z.string().url().max(255).optional().or(z.literal('')),
  moduleIds: z.array(z.number().int()).optional(),
  schedules: z.array(classroomTemplateScheduleSchema).optional(),
  startDate: z.string().transform((stringDate) => new Date(stringDate)),
  endDate: z.string().transform((stringDate) => new Date(stringDate)),
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
