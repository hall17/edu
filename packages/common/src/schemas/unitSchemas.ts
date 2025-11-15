import { z } from 'zod';

import { lessonCreateSchema, lessonUpdateSchema } from './lessonSchemas';
import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const unitCreateSchema = z.object({
  order: z.number().min(0),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  curriculumId: z.uuid().or(z.string()),
  lessons: z.array(lessonCreateSchema),
});

export const unitUpdateSchema = unitCreateSchema
  .partial()
  .merge(idSchema)
  .merge(
    z.object({
      lessons: z.array(lessonUpdateSchema),
    })
  );

export const unitFindAllSchema = z
  .object({
    subjectIds: z.array(z.string().uuid()).optional(),
    curriculumIds: z.array(z.string().uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export type UnitCreateDto = z.infer<typeof unitCreateSchema>;
export type UnitUpdateDto = z.infer<typeof unitUpdateSchema>;
export type UnitFindAllDto = z.infer<typeof unitFindAllSchema>;
