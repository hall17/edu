import Container from 'typedi';
import z from 'zod';

import { protectedProcedure, t } from '../../trpc';
import { idSchema } from '../../types';

import {
  studentCreateSchema,
  studentFindAllSchema,
  studentUpdateSchema,
  studentUpdateSignupStatusSchema,
  studentUpdateSuspendedSchema,
} from './studentModel';
import { StudentService } from './studentService';

const studentService = Container.get(StudentService);

export const studentRouter = t.router({
  findOne: protectedProcedure.input(idSchema).query(async ({ ctx, input }) => {
    return studentService.findOne(ctx.req.user, input.id);
  }),
  findAll: protectedProcedure
    .input(studentFindAllSchema)
    .query(async ({ ctx, input }) => {
      return studentService.findAll(ctx.req.user, input);
    }),
  create: protectedProcedure
    .input(studentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return studentService.create(ctx.req.user, input);
    }),
  createFromExcel: protectedProcedure
    .input(
      z
        .instanceof(FormData)
        .transform((fd) => Object.fromEntries(fd.entries()))
        .pipe(
          // @ts-ignore
          z.object({
            file: z.instanceof(File).refine((f: any) => f.size > 0),
          })
        )
    )
    .mutation(async ({ ctx, input }) => {
      return studentService.createFromExcel(ctx.req.user, input.file);
    }),
  update: protectedProcedure
    .input(studentUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return studentService.update(ctx.req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return studentService.delete(ctx.req.user, input.id);
    }),
  updateSignupStatus: protectedProcedure
    .input(studentUpdateSignupStatusSchema)
    .mutation(async ({ ctx, input }) => {
      return studentService.updateSignupStatus(ctx.req.user, input);
    }),
  updateSuspended: protectedProcedure
    .input(studentUpdateSuspendedSchema)
    .mutation(async ({ ctx, input }) => {
      return studentService.updateSuspended(ctx.req.user, input);
    }),
});
