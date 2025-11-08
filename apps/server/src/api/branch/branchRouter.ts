import { intIdSchema } from '@api/types';
import {
  branchCreateSchema,
  branchFindAllSchema,
  branchUpdateSchema,
  moduleUpdateStatusSchema,
  branchUpdateStatusSchema,
  branchUpdateMyBranchSchema,
} from '@edusama/common';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import { BranchService } from './branchService';

const branchService = Container.get(BranchService);

export const branchRouter = t.router({
  findAll: protectedProcedure
    .input(branchFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return branchService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(intIdSchema)
    .query(async ({ ctx: { req }, input }) => {
      return branchService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(branchCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return branchService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(branchUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return branchService.update(req.user, input);
    }),
  updateMyBranch: protectedProcedure
    .input(branchUpdateMyBranchSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return branchService.updateMyBranch(req.user, input);
    }),
  updateStatus: protectedProcedure
    .input(branchUpdateStatusSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return branchService.updateStatus(req.user, input);
    }),
  delete: protectedProcedure
    .input(intIdSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return branchService.delete(req.user, input.id);
    }),
  addModule: protectedProcedure
    .input(intIdSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return branchService.addModule(req.user, input.id);
    }),
  updateModuleStatus: protectedProcedure
    .input(moduleUpdateStatusSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return branchService.updateModuleStatus(req.user, input);
    }),
  deleteModule: protectedProcedure
    .input(intIdSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return branchService.deleteModule(req.user, input.id);
    }),
});
