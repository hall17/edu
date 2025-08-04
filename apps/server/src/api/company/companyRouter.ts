import { intIdSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  companyCreateSchema,
  companyFindAllSchema,
  companyUpdateStatusSchema,
  companyUpdateSchema,
} from './companyModel';
import { CompanyService } from './companyService';

const companyService = Container.get(CompanyService);

export const companyRouter = t.router({
  findAll: protectedProcedure
    .input(companyFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return companyService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(intIdSchema)
    .query(async ({ ctx: { req }, input }) => {
      return companyService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(companyCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return companyService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(companyUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return companyService.update(req.user, input);
    }),
  updateStatus: protectedProcedure
    .input(companyUpdateStatusSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return companyService.updateStatus(req.user, input);
    }),
  delete: protectedProcedure
    .input(intIdSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return companyService.delete(req.user, input.id);
    }),
});
