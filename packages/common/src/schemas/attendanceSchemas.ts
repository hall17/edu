import { z } from 'zod';

import {
  AttendanceNotificationType,
  AttendanceStatus,
  NotificationStatus,
} from '../enums';
import { idSchema, DefaultFilterSchema } from './sharedSchemas';

// AttendanceRecord schemas
export const attendanceRecordCreateSchema = z.object({
  id: z.string().optional(),
  studentId: z.uuid(),
  classroomIntegrationSessionId: z.uuid(),
  status: z.nativeEnum(AttendanceStatus),
  remarks: z.string().max(500).optional(),
});

export const attendanceRecordBulkCreateSchema = z.array(
  attendanceRecordCreateSchema
);

export const attendanceRecordUpdateSchema = z
  .object({})
  .merge(attendanceRecordCreateSchema)
  .partial()
  .merge(idSchema);

export const attendanceRecordFindAllSchema = z
  .object({
    studentId: z.string().optional(),
    classroomIntegrationSessionId: z.string().optional(),
    status: z.array(z.nativeEnum(AttendanceStatus)).optional(),
    sessionDateFrom: z
      .string()
      .transform((stringDate) => new Date(stringDate))
      .optional(),
    sessionDateTo: z
      .string()
      .transform((stringDate) => new Date(stringDate))
      .optional(),
  })
  .merge(DefaultFilterSchema);

// AttendanceSummary schemas
export const attendanceSummaryCreateSchema = z.object({
  studentId: z.string(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(3000),
  totalPresent: z.number().int().min(0),
  totalAbsent: z.number().int().min(0),
  totalPartial: z.number().int().min(0),
  classroomIntegrationId: z.string(),
});

export const attendanceSummaryUpdateSchema = z
  .object({})
  .merge(attendanceSummaryCreateSchema)
  .partial()
  .merge(idSchema);

export const attendanceSummaryFindAllSchema = z
  .object({
    studentId: z.string().optional(),
    month: z.number().int().optional(),
    year: z.number().int().optional(),
    classroomIntegrationId: z.string().optional(),
  })
  .merge(DefaultFilterSchema);

// AttendanceNotification schemas
export const attendanceNotificationCreateSchema = z.object({
  studentId: z.string(),
  classroomIntegrationId: z.string(),
  notificationType: z.nativeEnum(AttendanceNotificationType),
  notificationDate: z.string().transform((stringDate) => new Date(stringDate)),
  status: z.nativeEnum(NotificationStatus),
  acknowledgedAt: z
    .string()
    .transform((stringDate) => new Date(stringDate))
    .optional(),
});

export const attendanceNotificationUpdateSchema = z
  .object({})
  .merge(attendanceNotificationCreateSchema)
  .partial()
  .merge(idSchema);

export const attendanceNotificationFindAllSchema = z
  .object({
    studentId: z.string().optional(),
    classroomIntegrationId: z.string().optional(),
    notificationType: z
      .array(z.nativeEnum(AttendanceNotificationType))
      .optional(),
    status: z.array(z.nativeEnum(NotificationStatus)).optional(),
    notificationDateFrom: z
      .string()
      .transform((stringDate) => new Date(stringDate))
      .optional(),
    notificationDateTo: z
      .string()
      .transform((stringDate) => new Date(stringDate))
      .optional(),
  })
  .merge(DefaultFilterSchema);

// Export types
export type AttendanceRecordCreateDto = z.infer<
  typeof attendanceRecordCreateSchema
>;
export type AttendanceRecordBulkCreateDto = z.infer<
  typeof attendanceRecordBulkCreateSchema
>;
export type AttendanceRecordUpdateDto = z.infer<
  typeof attendanceRecordUpdateSchema
>;
export type AttendanceRecordFindAllDto = z.infer<
  typeof attendanceRecordFindAllSchema
>;

export type AttendanceSummaryCreateDto = z.infer<
  typeof attendanceSummaryCreateSchema
>;
export type AttendanceSummaryUpdateDto = z.infer<
  typeof attendanceSummaryUpdateSchema
>;
export type AttendanceSummaryFindAllDto = z.infer<
  typeof attendanceSummaryFindAllSchema
>;

export type AttendanceNotificationCreateDto = z.infer<
  typeof attendanceNotificationCreateSchema
>;
export type AttendanceNotificationUpdateDto = z.infer<
  typeof attendanceNotificationUpdateSchema
>;
export type AttendanceNotificationFindAllDto = z.infer<
  typeof attendanceNotificationFindAllSchema
>;
