import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';
import { idSchema } from '../../types';

import {
  attendanceRecordCreateSchema,
  attendanceRecordFindAllSchema,
  attendanceRecordUpdateSchema,
  attendanceSummaryCreateSchema,
  attendanceSummaryFindAllSchema,
  attendanceSummaryUpdateSchema,
  attendanceNotificationCreateSchema,
  attendanceNotificationFindAllSchema,
  attendanceNotificationUpdateSchema,
  attendanceRecordBulkCreateSchema,
} from './attendanceModel';
import { AttendanceService } from './attendanceService';

const attendanceService = Container.get(AttendanceService);

export const attendanceRouter = t.router({
  // AttendanceRecord procedures
  findOneAttendanceRecord: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      return attendanceService.findOneAttendanceRecord(ctx.req.user, input.id);
    }),
  findAllAttendanceRecords: protectedProcedure
    .input(attendanceRecordFindAllSchema)
    .query(async ({ ctx, input }) => {
      return attendanceService.findAllAttendanceRecords(ctx.req.user, input);
    }),
  createAttendanceRecord: protectedProcedure
    .input(attendanceRecordCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.createAttendanceRecord(ctx.req.user, input);
    }),
  saveAttendanceRecords: protectedProcedure
    .input(attendanceRecordBulkCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.saveAttendanceRecords(ctx.req.user, input);
    }),
  updateAttendanceRecord: protectedProcedure
    .input(attendanceRecordUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.updateAttendanceRecord(ctx.req.user, input);
    }),
  deleteAttendanceRecord: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.deleteAttendanceRecord(ctx.req.user, input.id);
    }),

  // AttendanceSummary procedures
  findOneAttendanceSummary: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      return attendanceService.findOneAttendanceSummary(ctx.req.user, input.id);
    }),
  findAllAttendanceSummaries: protectedProcedure
    .input(attendanceSummaryFindAllSchema)
    .query(async ({ ctx, input }) => {
      return attendanceService.findAllAttendanceSummaries(ctx.req.user, input);
    }),
  createAttendanceSummary: protectedProcedure
    .input(attendanceSummaryCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.createAttendanceSummary(ctx.req.user, input);
    }),
  updateAttendanceSummary: protectedProcedure
    .input(attendanceSummaryUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.updateAttendanceSummary(ctx.req.user, input);
    }),
  deleteAttendanceSummary: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.deleteAttendanceSummary(ctx.req.user, input.id);
    }),

  // AttendanceNotification procedures
  findOneAttendanceNotification: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      return attendanceService.findOneAttendanceNotification(
        ctx.req.user,
        input.id
      );
    }),
  findAllAttendanceNotifications: protectedProcedure
    .input(attendanceNotificationFindAllSchema)
    .query(async ({ ctx, input }) => {
      return attendanceService.findAllAttendanceNotifications(
        ctx.req.user,
        input
      );
    }),
  createAttendanceNotification: protectedProcedure
    .input(attendanceNotificationCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.createAttendanceNotification(
        ctx.req.user,
        input
      );
    }),
  updateAttendanceNotification: protectedProcedure
    .input(attendanceNotificationUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.updateAttendanceNotification(
        ctx.req.user,
        input
      );
    }),
  deleteAttendanceNotification: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return attendanceService.deleteAttendanceNotification(
        ctx.req.user,
        input.id
      );
    }),
});
