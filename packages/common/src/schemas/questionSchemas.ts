import { z } from 'zod';

import { QuestionDifficulty, QuestionType } from '../enums';
import { idSchema, DefaultFilterSchema } from './sharedSchemas';

// Base option schema used across multiple question types
const optionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

// Multiple choice question data schema
const multipleChoiceQuestionDataSchema = z.object({
  options: z.array(z.string().min(1)),
  correctAnswers: z.array(z.number()).min(1),
  multipleChoiceType: z.enum(['SINGLE_ANSWER', 'MULTIPLE_ANSWERS']),
});

// True/False question data schema
const trueFalseQuestionDataSchema = z.object({
  correctAnswers: z.enum(['true', 'false']).array().min(1).max(1),
});

// Short answer question data schema
const shortAnswerQuestionDataSchema = z.object({
  correctAnswers: z.array(z.string()),
});

// Essay question data schema
const essayQuestionDataSchema = z.object({
  correctAnswers: z.array(z.string()).optional(),
});

// Fill in the blank question data schema
const fillInBlankQuestionDataSchema = z.object({
  correctAnswers: z.array(z.number()).min(1),
});

// Matching question data schema
const matchingQuestionDataSchema = z
  .object({
    pairs: z.object({
      leftColumn: z.array(z.string().min(1)),
      rightColumn: z.array(z.string().min(1)),
    }),
    correctAnswers: z.record(z.number(), z.number()),
  })
  .refine(
    (data) => {
      return data.pairs.leftColumn.length === data.pairs.rightColumn.length;
    },
    {
      message: 'Left and right column must have the same length',
      path: ['pairs'],
    }
  )
  .refine(
    (data) => {
      return (
        Object.keys(data.correctAnswers).length === data.pairs.leftColumn.length
      );
    },
    {
      message: 'Correct answers must have the same length as the left column',
      path: ['correctAnswers'],
    }
  );

// Ordering question data schema
const orderingQuestionDataSchema = z.object({
  options: z.array(z.string().min(1)),
  correctAnswers: z.array(z.number()),
});

// Export individual schemas for type inference
export type MultipleChoiceQuestionData = z.infer<
  typeof multipleChoiceQuestionDataSchema
>;
export type TrueFalseQuestionData = z.infer<typeof trueFalseQuestionDataSchema>;
export type ShortAnswerQuestionData = z.infer<
  typeof shortAnswerQuestionDataSchema
>;
export type EssayQuestionData = z.infer<typeof essayQuestionDataSchema>;
export type FillInBlankQuestionData = z.infer<
  typeof fillInBlankQuestionDataSchema
>;
export type MatchingQuestionData = z.infer<typeof matchingQuestionDataSchema>;
export type OrderingQuestionData = z.infer<typeof orderingQuestionDataSchema>;

export const questionDataSchema = z.union([
  multipleChoiceQuestionDataSchema,
  trueFalseQuestionDataSchema,
  shortAnswerQuestionDataSchema,
  essayQuestionDataSchema,
  fillInBlankQuestionDataSchema,
  matchingQuestionDataSchema,
  orderingQuestionDataSchema,
]);

export type QuestionData = z.infer<typeof questionDataSchema>;

// Helper function to get the correct schema based on question type
export function getQuestionDataSchema(type: QuestionType): z.ZodTypeAny {
  switch (type) {
    case 'MULTIPLE_CHOICE':
      return multipleChoiceQuestionDataSchema;
    case 'TRUE_FALSE':
      return trueFalseQuestionDataSchema;
    case 'SHORT_ANSWER':
      return shortAnswerQuestionDataSchema;
    case 'ESSAY':
      return essayQuestionDataSchema;
    case 'FILL_IN_BLANK':
      return fillInBlankQuestionDataSchema;
    case 'MATCHING':
      return matchingQuestionDataSchema;
    case 'ORDERING':
      return orderingQuestionDataSchema;
    default:
      throw new Error(`Unknown question type: ${type}`);
  }
}

// Helper function to validate question data based on question type
export function validateQuestionData(type: QuestionType, data: unknown) {
  const schema = getQuestionDataSchema(type);
  return schema.parse(data) as QuestionData;
}

// Complete question schema with questionData validation
export const questionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(QuestionType),
  difficulty: z.enum(QuestionDifficulty),
  questionText: z.string().min(1),
  questionData: questionDataSchema,
  subjectId: z.string().uuid(),
  curriculumId: z.string().uuid().optional(),
  lessonId: z.string().uuid().optional(),
});

// Type exports for question schemas
export type Question = z.infer<typeof questionSchema>;

// Form schema for creating/editing questions - more permissive for react-hook-form compatibility
export const questionFormSchema = z.object({
  type: z.nativeEnum(QuestionType),
  difficulty: z.nativeEnum(QuestionDifficulty),
  questionText: z.string().min(1, 'Question text is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  curriculumId: z.string().uuid().optional(),
  lessonId: z.string().uuid().optional(),
  questionData: questionDataSchema,
});

// Type export for form schema
export type QuestionForm = z.infer<typeof questionFormSchema>;

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
  })
  .merge(DefaultFilterSchema);

export const questionFindQuestionsRandomSchema = z.object({
  type: z.enum(QuestionType).optional(),
  difficulty: z.enum(QuestionDifficulty).optional(),
  subjectId: z.uuid(),
  curriculumIds: z.array(z.uuid()).optional(),
  lessonIds: z.array(z.uuid()).optional(),
  count: z.number().int().min(1).max(100),
  excludeQuestionIds: z.array(z.uuid()).optional(),
});

export type QuestionCreateDto = z.infer<typeof questionCreateSchema>;
export type QuestionUpdateDto = z.infer<typeof questionUpdateSchema>;
export type QuestionFindAllDto = z.infer<typeof questionFindAllSchema>;
export type QuestionFindQuestionsRandomDto = z.infer<
  typeof questionFindQuestionsRandomSchema
>;
