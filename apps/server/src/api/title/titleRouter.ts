import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  titleCreateSchema,
  titleFindAllSchema,
  titleUpdateSchema,
} from './titleModel';
import { TitleService } from './titleService';

const titleService = Container.get(TitleService);

export const titleRouter = t.router({
  findAll: protectedProcedure
    .input(titleFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return titleService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return titleService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(titleCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return titleService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(titleUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return titleService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return titleService.delete(req.user, input.id);
    }),
});
