import { DayOfWeek } from '@edusama/common';
import z from 'zod';

import i18n from '@/lib/i18n';

export const basicSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  capacity: z.number().int().min(1).max(1000),
  attendancePassPercentage: z.number().int().min(0).max(100),
  assessmentScorePass: z.number().int().min(0).max(100),
  assignmentScorePass: z.number().int().min(0).max(100),
  sendNotifications: z.boolean().optional(),
  attendanceThreshold: z.number().int().min(0).max(100).optional(),
  reminderFrequency: z.number().int().optional(),
  startDate: z.date(),
  endDate: z.date(),
  imageUrl: z.string().optional(),
  classroomTemplateId: z.string().uuid().optional(),
});

export const modulesSchema = z.object({
  moduleIds: z.array(z.number().int()).optional(),
});

export const integrationsSchema = z.object({
  integrations: z
    .array(
      z.object({
        id: z.uuid(),
        classroomId: z.uuid().optional(),
        subjectId: z.uuid().min(1),
        curriculumId: z.uuid().min(1),
        teacherId: z.uuid().min(1),
        accessLink: z.string().url().max(255).optional().or(z.literal('')),
        schedules: z
          .array(
            z.object({
              dayOfWeek: z.nativeEnum(DayOfWeek),
              startTime: z
                .string()
                .regex(
                  /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                  'Invalid time format (HH:MM)'
                ),
              endTime: z
                .string()
                .regex(
                  /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                  'Invalid time format (HH:MM)'
                ),
            })
          )
          .optional(),
        sessions: z.array(
          z.object({
            id: z.uuid(),
            startDate: z.string().min(1),
            endDate: z.string().min(1),
            description: z.string().max(500).optional().nullable(),
            teacherId: z.uuid().optional().nullable(),
            lessonIds: z.array(z.string()).optional(),
          })
        ),
      })
    )
    .refine(
      (integrations) => {
        const subjectIds = integrations.map(
          (integration) => integration.subjectId
        );
        const uniqueSubjectIds = new Set(subjectIds);
        return subjectIds.length === uniqueSubjectIds.size;
      },
      {
        message: i18n.t(
          'classrooms.actionDialog.integrations.subjectAlreadySelected'
        ),
        path: ['integrations'],
      }
    ),
});

export const classroomFormSchema = basicSchema
  .merge(modulesSchema)
  .merge(integrationsSchema)
  .refine((data) => data.endDate > data.startDate, {
    message: i18n.t('common.endDateMustBeAfterStartDate'),
    path: ['endDate'],
  });

export type ClassroomFormData = z.infer<typeof classroomFormSchema>;
export type ClassroomFormDataIntegrationSchedule = NonNullable<
  ClassroomFormData['integrations'][number]['schedules']
>[number];

export const classroomFormInitialValues: ClassroomFormData = {
  name: '',
  description: '',
  capacity: 30,
  attendancePassPercentage: 80,
  assessmentScorePass: 80,
  assignmentScorePass: 80,
  startDate: new Date(),
  endDate: (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 6); // Default to 6 months from now
    return date;
  })(),
  imageUrl: undefined,
  classroomTemplateId: undefined,
  moduleIds: [],
  integrations: [
    {
      id: crypto.randomUUID(),
      classroomId: undefined,
      subjectId: '',
      curriculumId: '',
      teacherId: '',
      schedules: [],
      accessLink: '',
      sessions: [],
    },
  ],
};
