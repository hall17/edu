import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  curriculumCreateSchema,
  curriculumFindAllSchema,
  curriculumUpdateSchema,
} from './curriculumModel';
import { CurriculumService } from './curriculumService';

const curriculumService = Container.get(CurriculumService);

export const curriculumRouter = t.router({
  findAll: protectedProcedure
    .input(curriculumFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return curriculumService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return curriculumService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(curriculumCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return curriculumService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(curriculumUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return curriculumService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return curriculumService.delete(req.user, input.id);
    }),
});
