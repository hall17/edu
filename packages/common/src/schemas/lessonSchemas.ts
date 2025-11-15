import { z } from 'zod';

import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const lessonCreateSchema = z.object({
  unitId: z.uuid(),
  order: z.number().min(0),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const lessonUpdateSchema = lessonCreateSchema.partial().merge(idSchema);

export const lessonUpdateOrderSchema = z.object({
  lessonIds: z.array(z.string().uuid()),
});

export const lessonFindAllSchema = z
  .object({
    subjectIds: z.array(z.string().uuid()).optional(),
    curriculumIds: z.array(z.string().uuid()).optional(),
    unitIds: z.array(z.string().uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export type LessonCreateDto = z.infer<typeof lessonCreateSchema>;
export type LessonUpdateDto = z.infer<typeof lessonUpdateSchema>;
export type LessonUpdateOrderDto = z.infer<typeof lessonUpdateOrderSchema>;
export type LessonFindAllDto = z.infer<typeof lessonFindAllSchema>;
