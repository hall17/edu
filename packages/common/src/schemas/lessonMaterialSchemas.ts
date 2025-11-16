import { z } from 'zod';

import { LessonMaterialType } from '../enums';

import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const lessonMaterialCreateSchema = z.object({
  lessonId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(Object.values(LessonMaterialType)),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  duration: z.number().int().min(0).optional(),
  pageCount: z.number().int().min(1).optional(),
  isShareable: z.boolean(),
});

export const lessonMaterialUpdateSchema = lessonMaterialCreateSchema
  .partial()
  .merge(idSchema);

export const lessonMaterialFindAllSchema = z
  .object({
    lessonIds: z.array(z.string().uuid()).optional(),
    subjectIds: z.array(z.string().uuid()).optional(),
    curriculumIds: z.array(z.string().uuid()).optional(),
    unitIds: z.array(z.string().uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export type LessonMaterialCreateDto = z.infer<
  typeof lessonMaterialCreateSchema
>;
export type LessonMaterialUpdateDto = z.infer<
  typeof lessonMaterialUpdateSchema
>;
export type LessonMaterialFindAllDto = z.infer<
  typeof lessonMaterialFindAllSchema
>;
