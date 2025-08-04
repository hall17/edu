import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  lessonCreateSchema,
  lessonFindAllSchema,
  lessonUpdateSchema,
} from './lessonModel';
import { LessonService } from './lessonService';

const lessonService = Container.get(LessonService);

export const lessonRouter = t.router({
  findAll: protectedProcedure
    .input(lessonFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return lessonService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return lessonService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(lessonCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return lessonService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(lessonUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return lessonService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return lessonService.delete(req.user, input.id);
    }),
});
