import { DayOfWeek } from '@edusama/server';
import { TFunction } from 'i18next';
import z from 'zod';

export function getFormSchema(t: TFunction) {
  const basicSchema = z.object({
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

  const modulesSchema = z.object({
    moduleIds: z.array(z.number().int()).optional(),
  });

  const integrationsSchema = z.object({
    integrations: z
      .array(
        z.object({
          id: z.string().uuid().optional(),
          classroomId: z.uuid().optional(),
          subjectId: z.uuid(),
          curriculumId: z.uuid(),
          teacherId: z.uuid().optional().nullable(),
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
          message: t(
            'classrooms.actionDialog.integrations.subjectAlreadySelected'
          ),
          path: ['integrations'],
        }
      ),
  });

  const schema = basicSchema
    .merge(modulesSchema)
    .merge(integrationsSchema)
    .refine((data) => data.endDate > data.startDate, {
      message: t('common.endDateMustBeAfterStartDate'),
      path: ['endDate'],
    });

  return { schema, basicSchema, modulesSchema, integrationsSchema };
}

export type FormData = z.infer<ReturnType<typeof getFormSchema>['schema']>;
