import { z } from 'zod';

import { ClassroomStatus, DayOfWeek, EnrollmentStatus } from '../enums';

import { attendanceRecordCreateSchema } from './attendanceSchemas';
import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const classroomIntegrationScheduleSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z.date(),
  endTime: z.date(),
});

export const createIntegrationSessionSchema = z.object({
  classroomIntegrationId: z.string().uuid(),
  description: z.string().optional(),
  lessonIds: z.array(z.string().uuid()).optional(),
  teacherId: z.uuid().optional().nullable(),
  startDate: z.date(),
  endDate: z.date(),
});

export const createClassroomIntegrationSchema = z.object({
  id: z.string().uuid().optional(),
  subjectId: z.uuid(),
  curriculumId: z.uuid(),
  teacherId: z.uuid(),
  schedules: z.array(classroomIntegrationScheduleSchema).optional(),
  accessLink: z.string().url().max(255).optional().or(z.literal('')),
  sessions: z
    .array(
      createIntegrationSessionSchema.omit({ classroomIntegrationId: true })
    )
    .optional(),
});

export const updateClassroomIntegrationSchema = createClassroomIntegrationSchema
  .partial()
  .merge(idSchema);

export const classroomCreateSchema = z
  .object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    capacity: z.number().int().min(1).max(1000),
    imageUrl: z.string().max(1000).nullable().optional(),
    attendancePassPercentage: z.number().int().min(0).max(100).default(80),
    assessmentScorePass: z.number().int().min(0).max(100).default(80),
    assignmentScorePass: z.number().int().min(0).max(100).default(80),
    reminderFrequency: z.number().int().optional(),
    attendanceThreshold: z.number().int().min(0).max(100).optional(),
    sendNotifications: z.boolean().optional(),
    startDate: z.date(),
    endDate: z.date(),
    classroomTemplateId: z.string().uuid().optional(),
    moduleIds: z.array(z.number().int()).optional(),
    integrations: z.array(createClassroomIntegrationSchema).optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const classroomUpdateSchema = classroomCreateSchema
  .partial()
  .merge(
    z.object({
      status: z.nativeEnum(ClassroomStatus).optional(),
    })
  )
  .merge(idSchema);

export const classroomUpdateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(ClassroomStatus),
  statusUpdateReason: z.string().optional(),
});

export const classroomFindAllSchema = z
  .object({
    branchIds: z.array(z.number().int()).optional(),
    classroomTemplateIds: z.array(z.string().uuid()).optional(),
    subjectIds: z.array(z.string().uuid()).optional(),
    curriculumIds: z.array(z.string().uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export const classroomStudentsFindAllSchema = z
  .object({
    classroomId: z.string().uuid(),
    status: z.array(z.nativeEnum(EnrollmentStatus)).optional(),
  })
  .merge(DefaultFilterSchema);

export const enrollStudentSchema = z.object({
  classroomId: z.string().uuid(),
  studentId: z.string().uuid(),
});

export const unenrollStudentSchema = z.object({
  classroomId: z.string().uuid(),
  studentId: z.string().uuid(),
});

export const updateStudentEnrollmentStatusSchema = z.object({
  classroomId: z.string().uuid(),
  studentId: z.string().uuid(),
  status: z.nativeEnum(EnrollmentStatus),
});

export const createAnnouncementSchema = z.object({
  classroomId: z.string().uuid(),
  title: z.string().min(1).max(100),
  content: z.string().max(500).optional(),
});

export const updateAnnouncementSchema = createAnnouncementSchema
  .partial()
  .merge(idSchema);

export const findAllIntegrationSessionsSchema = z
  .object({
    classroomId: z.uuid(),
    subjectIds: z.array(z.string().uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export const updateIntegrationSessionSchema = createIntegrationSessionSchema
  .partial()
  .merge(idSchema)
  .merge(
    z.object({
      isAttendanceRecordCompleted: z.boolean().optional(),
      attendanceRecords: z
        .array(
          attendanceRecordCreateSchema.omit({
            classroomIntegrationSessionId: true,
          })
        )
        .optional(),
    })
  );

export const findAllClassroomIntegrationsSchema = z
  .object({
    classroomIds: z.array(z.uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export const findAllClassroomIntegrationAssessmentsSchema = z
  .object({
    subjectIds: z.array(z.uuid()).optional(),
    curriculumIds: z.array(z.uuid()).optional(),
    lessonIds: z.array(z.uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export type ClassroomCreateDto = z.infer<typeof classroomCreateSchema>;
export type ClassroomUpdateDto = z.infer<typeof classroomUpdateSchema>;
export type ClassroomUpdateStatusDto = z.infer<
  typeof classroomUpdateStatusSchema
>;
export type ClassroomFindAllDto = z.infer<typeof classroomFindAllSchema>;
export type ClassroomStudentsFindAllDto = z.infer<
  typeof classroomStudentsFindAllSchema
>;
export type EnrollStudentDto = z.infer<typeof enrollStudentSchema>;
export type UnenrollStudentDto = z.infer<typeof unenrollStudentSchema>;
export type UpdateStudentEnrollmentStatusDto = z.infer<
  typeof updateStudentEnrollmentStatusSchema
>;
export type CreateAnnouncementDto = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementDto = z.infer<typeof updateAnnouncementSchema>;
export type CreateClassroomIntegrationDto = z.infer<
  typeof createClassroomIntegrationSchema
>;
export type UpdateClassroomIntegrationDto = z.infer<
  typeof updateClassroomIntegrationSchema
>;
export type ClassroomIntegrationScheduleDto = z.infer<
  typeof classroomIntegrationScheduleSchema
>;
export type CreateIntegrationSessionDto = z.infer<
  typeof createIntegrationSessionSchema
>;
export type UpdateIntegrationSessionDto = z.infer<
  typeof updateIntegrationSessionSchema
>;
export type FindAllClassroomIntegrationsDto = z.infer<
  typeof findAllClassroomIntegrationsSchema
>;
export type FindAllClassroomIntegrationAssessmentsDto = z.infer<
  typeof findAllClassroomIntegrationAssessmentsSchema
>;
export type FindAllIntegrationSessionsDto = z.infer<
  typeof findAllIntegrationSessionsSchema
>;
