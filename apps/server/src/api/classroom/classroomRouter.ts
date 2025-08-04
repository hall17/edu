import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  classroomCreateSchema,
  classroomFindAllSchema,
  classroomStudentsFindAllSchema,
  classroomUpdateSchema,
  createAnnouncementSchema,
  enrollStudentSchema,
  unenrollStudentSchema,
  updateAnnouncementSchema,
  updateStudentEnrollmentStatusSchema,
  findAllClassroomIntegrationsSchema,
  createIntegrationSessionSchema,
  updateIntegrationSessionSchema,
  classroomIntegrationSessionFindAllSchema,
  classroomUpdateStatusSchema,
} from './classroomModel';
import { ClassroomService } from './classroomService';

const classroomService = Container.get(ClassroomService);

export const classroomRouter = t.router({
  findAll: protectedProcedure
    .input(classroomFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return classroomService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return classroomService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(classroomCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(classroomUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.update(req.user, input);
    }),
  updateStatus: protectedProcedure
    .input(classroomUpdateStatusSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.updateStatus(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.delete(req.user, input.id);
    }),
  findAllStudents: protectedProcedure
    .input(classroomStudentsFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return classroomService.findAllStudents(req.user, input);
    }),
  enrollStudent: protectedProcedure
    .input(enrollStudentSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.enrollStudent(req.user, input);
    }),
  unenrollStudent: protectedProcedure
    .input(unenrollStudentSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.unenrollStudent(req.user, input);
    }),
  updateStudentEnrollmentStatus: protectedProcedure
    .input(updateStudentEnrollmentStatusSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.updateStudentEnrollmentStatus(req.user, input);
    }),
  createAnnouncement: protectedProcedure
    .input(createAnnouncementSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.createAnnouncement(req.user, input);
    }),
  updateAnnouncement: protectedProcedure
    .input(updateAnnouncementSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.updateAnnouncement(req.user, input);
    }),
  deleteAnnouncement: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.deleteAnnouncement(req.user, input.id);
    }),
  generateAccessLink: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.generateAccessLink(req.user, input.id);
    }),
  findAllIntegrationSessions: protectedProcedure
    .input(classroomIntegrationSessionFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return classroomService.findAllIntegrationSessions(req.user, input);
    }),
  createIntegrationSession: protectedProcedure
    .input(createIntegrationSessionSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.createIntegrationSession(req.user, input);
    }),
  updateIntegrationSession: protectedProcedure
    .input(updateIntegrationSessionSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomService.updateIntegrationSession(req.user, input);
    }),
  findAllClassroomIntegrations: protectedProcedure
    .input(findAllClassroomIntegrationsSchema)
    .query(async ({ ctx: { req }, input }) => {
      return classroomService.findAllClassroomIntegrations(req.user, input);
    }),
  findOneClassroomIntegration: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return classroomService.findOneClassroomIntegration(req.user, input.id);
    }),
});
