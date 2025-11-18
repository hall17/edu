import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  subjectCreateSchema,
  subjectFindAllSchema,
  subjectUpdateSchema,
} from './subjectModel';
import { SubjectService } from './subjectService';

const subjectService = Container.get(SubjectService);

export const subjectRouter = t.router({
  findAll: protectedProcedure
    .input(subjectFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return subjectService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req, res }, input }) => {
      const result = await subjectService.findOne(req.user, input.id);
      const cookies: string[] = [];
      Object.entries(result.cookies).forEach(([key, value]) => {
        cookies.push(
          `${key}=${(value as { value: string }).value}; Domain=.edusama.com; Path=/; SameSite=None; Secure;`
        );
      });
      res.setHeader('Set-Cookie', cookies);
      return result.subject;
    }),
  create: protectedProcedure
    .input(subjectCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return subjectService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(subjectUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return subjectService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return subjectService.delete(req.user, input.id);
    }),
});
