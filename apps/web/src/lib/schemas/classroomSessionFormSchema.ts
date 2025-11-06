import { AttendanceStatus } from '@edusama/common';
import dayjs from 'dayjs';
import { z } from 'zod';

import i18n from '@/lib/i18n';

const attendanceRecordSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  status: z.nativeEnum(AttendanceStatus),
  remarks: z.string().max(500).optional(),
});

export const classroomSessionFormSchema = z
  .object({
    id: z.uuid(),
    classroomIntegrationId: z.string().min(1),
    teacherId: z.string().min(1),
    description: z.string().optional(),
    lessonIds: z.array(z.string()).optional(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    attendanceRecords: z
      .array(
        attendanceRecordSchema.extend({
          status: z.nativeEnum(AttendanceStatus).or(z.literal('none')),
        })
      )
      .optional(),
    isAttendanceRecordCompleted: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const startDate = dayjs(data.startDate);
        const endDate = dayjs(data.endDate);

        // Check if both dates are on the same day
        const isSameDay = startDate.isSame(endDate, 'day');

        if (!isSameDay) {
          return false;
        }

        // If same day, check if end time is after start time
        return startDate.isBefore(endDate);
      }
      return true;
    },
    {
      path: ['startDate'],
      error: i18n.t('common.sessionMustBeOnSameDay'),
    }
  );

export type ClassroomSessionFormData = z.infer<
  typeof classroomSessionFormSchema
>;

export const classroomSessionFormInitialValues: ClassroomSessionFormData = {
  id: crypto.randomUUID(),
  classroomIntegrationId: '',
  teacherId: '',
  description: '',
  lessonIds: [],
  startDate: '',
  endDate: '',
  attendanceRecords: [],
  isAttendanceRecordCompleted: false,
};
