import { z } from 'zod';

import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const lessonCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  curriculumId: z.uuid(),
});

export const lessonUpdateSchema = lessonCreateSchema.partial().merge(idSchema);

export const lessonFindAllSchema = z
  .object({
    curriculumIds: z.array(z.string().uuid()).optional(),
    subjectIds: z.array(z.string().uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export type LessonCreateDto = z.infer<typeof lessonCreateSchema>;
export type LessonUpdateDto = z.infer<typeof lessonUpdateSchema>;
export type LessonFindAllDto = z.infer<typeof lessonFindAllSchema>;
