import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  permissionCreateSchema,
  permissionFindAllSchema,
  permissionUpdateSchema,
  assignPermissionsToRoleSchema,
  removePermissionsFromRoleSchema,
} from './permissionModel';
import { PermissionService } from './permissionService';

const permissionService = Container.get(PermissionService);

export const permissionRouter = t.router({
  findAll: protectedProcedure
    .input(permissionFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return permissionService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return permissionService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(permissionCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return permissionService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(permissionUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return permissionService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return permissionService.delete(req.user, input.id);
    }),
  assignToRole: protectedProcedure
    .input(assignPermissionsToRoleSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return permissionService.assignPermissionsToRole(req.user, input);
    }),
  removeFromRole: protectedProcedure
    .input(removePermissionsFromRoleSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return permissionService.removePermissionsFromRole(req.user, input);
    }),
  findByRole: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return permissionService.findPermissionsByRole(req.user, input.id);
    }),
});
