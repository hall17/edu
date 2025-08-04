import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';
import { idSchema } from '../../types';

import {
  parentCreateSchema,
  parentFindAllSchema,
  parentUpdateSchema,
  parentUpdateSuspendedSchema,
} from './parentModel';
import { ParentService } from './parentService';

const parentService = Container.get(ParentService);

export const parentRouter = t.router({
  findOne: protectedProcedure.input(idSchema).query(async ({ ctx, input }) => {
    return parentService.findOne(ctx.req.user, input.id);
  }),
  findAll: protectedProcedure
    .input(parentFindAllSchema)
    .query(async ({ ctx, input }) => {
      return parentService.findAll(ctx.req.user, input);
    }),
  create: protectedProcedure
    .input(parentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return parentService.create(ctx.req.user, input);
    }),
  update: protectedProcedure
    .input(parentUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return parentService.update(ctx.req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return parentService.delete(ctx.req.user, input.id);
    }),
  updateSuspended: protectedProcedure
    .input(parentUpdateSuspendedSchema)
    .mutation(async ({ ctx, input }) => {
      return parentService.updateSuspended(ctx.req.user, input);
    }),
});
