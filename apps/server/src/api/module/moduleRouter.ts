import { intIdSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  moduleCreateSchema,
  moduleFindAllSchema,
  moduleUpdateSchema,
} from './moduleModel';
import { ModuleService } from './moduleService';

const moduleService = Container.get(ModuleService);

export const moduleRouter = t.router({
  findAll: protectedProcedure
    .input(moduleFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return moduleService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(intIdSchema)
    .query(async ({ ctx: { req }, input }) => {
      return moduleService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(moduleCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return moduleService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(moduleUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return moduleService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(intIdSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return moduleService.delete(req.user, input.id);
    }),
});
