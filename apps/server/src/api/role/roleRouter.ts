import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  roleCreateSchema,
  roleFindAllSchema,
  roleUpdateSchema,
} from './roleModel';
import { RoleService } from './roleService';

const roleService = Container.get(RoleService);

export const roleRouter = t.router({
  findAll: protectedProcedure
    .input(roleFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return roleService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return roleService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(roleCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return roleService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(roleUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return roleService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return roleService.delete(req.user, input.id);
    }),
});
