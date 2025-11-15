import { idSchema } from '@api/types';
import {
  unitCreateSchema,
  unitFindAllSchema,
  unitUpdateSchema,
} from '@edusama/common';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import { UnitService } from './unitService';

const unitService = Container.get(UnitService);

export const unitRouter = t.router({
  findAll: protectedProcedure
    .input(unitFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return unitService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return unitService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(unitCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return unitService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(unitUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return unitService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return unitService.delete(req.user, input.id);
    }),
});
