import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';
import { idSchema } from '../../types';

import {
  userCreateSchema,
  userFindAllSchema,
  userUpdateSchema,
  userUpdateSuspendedSchema,
} from './userModel';
import { UserService } from './userService';

const userService = Container.get(UserService);

export const userRouter = t.router({
  findOne: protectedProcedure.input(idSchema).query(async ({ ctx, input }) => {
    return userService.findOne(ctx.req.user, input.id);
  }),
  findAll: protectedProcedure
    .input(userFindAllSchema)
    .query(async ({ ctx, input }) => {
      return userService.findAll(ctx.req.user, input);
    }),
  create: protectedProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return userService.create(ctx.req.user, input);
    }),
  update: protectedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return userService.update(ctx.req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return userService.delete(ctx.req.user, input.id);
    }),
  updateSuspended: protectedProcedure
    .input(userUpdateSuspendedSchema)
    .mutation(async ({ ctx, input }) => {
      return userService.updateSuspended(ctx.req.user, input);
    }),
});
