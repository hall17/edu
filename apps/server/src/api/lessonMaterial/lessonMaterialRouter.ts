import { idSchema } from '@api/types';
import {
  lessonMaterialCreateSchema,
  lessonMaterialFindAllSchema,
  lessonMaterialUpdateSchema,
} from '@edusama/common';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import { LessonMaterialService } from './lessonMaterialService';

const lessonMaterialService = Container.get(LessonMaterialService);

export const lessonMaterialRouter = t.router({
  findAll: protectedProcedure
    .input(lessonMaterialFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return lessonMaterialService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return lessonMaterialService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(lessonMaterialCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return lessonMaterialService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(lessonMaterialUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return lessonMaterialService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return lessonMaterialService.delete(req.user, input.id);
    }),
});
