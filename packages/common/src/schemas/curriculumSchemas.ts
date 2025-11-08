import { z } from 'zod';

import { CurriculumStatus } from '../enums';
import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const curriculumCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  subjectId: z.uuid().or(z.string()),
  lessons: z.array(
    z.object({
      id: z.string().uuid().optional(),
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional().nullable(),
      order: z.number().optional(),
    })
  ),
});

export const curriculumUpdateSchema = curriculumCreateSchema
  .partial()
  .merge(
    z.object({
      status: z.nativeEnum(CurriculumStatus).optional(),
    })
  )
  .merge(idSchema);

export const curriculumFindAllSchema = z
  .object({
    status: z.nativeEnum(CurriculumStatus).optional(),
    subjectIds: z.array(z.string().uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export type CurriculumCreateDto = z.infer<typeof curriculumCreateSchema>;
export type CurriculumUpdateDto = z.infer<typeof curriculumUpdateSchema>;
export type CurriculumFindAllDto = z.infer<typeof curriculumFindAllSchema>;
