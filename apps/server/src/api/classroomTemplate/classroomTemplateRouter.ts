import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  classroomTemplateCreateSchema,
  classroomTemplateFindAllSchema,
  classroomTemplateUpdateSchema,
} from './classroomTemplateModel';
import { ClassroomTemplateService } from './classroomTemplateService';

const classroomTemplateService = Container.get(ClassroomTemplateService);

export const classroomTemplateRouter = t.router({
  findAll: protectedProcedure
    .input(classroomTemplateFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return classroomTemplateService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return classroomTemplateService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(classroomTemplateCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomTemplateService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(classroomTemplateUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomTemplateService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return classroomTemplateService.delete(req.user, input.id);
    }),
});
