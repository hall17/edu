import { questionDataSchema } from '@edusama/common';
import {
  QuestionType,
  QuestionDifficulty,
} from '@api/prisma/generated/prisma/client';
import { z } from 'zod';

import { DefaultFilterSchema, idSchema } from '../../types';

export const questionCreateSchema = z.object({
  type: z.enum(QuestionType),
  difficulty: z.enum(QuestionDifficulty),
  questionText: z.string().min(1),
  questionData: questionDataSchema,
  subjectId: z.string().uuid(),
  curriculumId: z.string().uuid().optional(),
  lessonId: z.string().uuid().optional(),
});

export const questionUpdateSchema = questionCreateSchema
  .partial()
  .merge(idSchema);

export const questionFindAllSchema = z
  .object({
    type: z.array(z.nativeEnum(QuestionType)).optional(),
    difficulty: z.array(z.nativeEnum(QuestionDifficulty)).optional(),
    subjectIds: z.array(z.uuid()).optional(),
    curriculumIds: z.array(z.uuid()).optional(),
    lessonIds: z.array(z.uuid()).optional(),
    branchIds: z.array(z.number().int()).optional(),
  })
  .merge(DefaultFilterSchema);

export const questionFindQuestionsRandomSchema = z.object({
  type: z.enum(QuestionType).optional(),
  difficulty: z.enum(QuestionDifficulty).optional(),
  subjectId: z.uuid(),
  curriculumId: z.uuid().optional(),
  lessonIds: z.array(z.uuid()).optional(),
  count: z.number().int().min(1).max(100),
});

export type QuestionCreateDto = z.infer<typeof questionCreateSchema>;
export type QuestionUpdateDto = z.infer<typeof questionUpdateSchema>;
export type QuestionFindAllDto = z.infer<typeof questionFindAllSchema>;
export type QuestionFindQuestionsRandomDto = z.infer<
  typeof questionFindQuestionsRandomSchema
>;
