import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  questionCreateSchema,
  questionFindAllSchema,
  questionFindQuestionsRandomSchema,
  questionUpdateSchema,
} from './questionModel';
import { QuestionService } from './questionService';

const questionService = Container.get(QuestionService);

export const questionRouter = t.router({
  findMetadata: protectedProcedure.query(async ({ ctx: { req } }) => {
    return questionService.findMetadata(req.user);
  }),
  findAll: protectedProcedure
    .input(questionFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return questionService.findAll(req.user, input);
    }),
  findQuestionsRandom: protectedProcedure
    .input(questionFindQuestionsRandomSchema)
    .query(async ({ ctx: { req }, input }) => {
      return questionService.findQuestionsRandom(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return questionService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(questionCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return questionService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(questionUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return questionService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return questionService.delete(req.user, input.id);
    }),
});
