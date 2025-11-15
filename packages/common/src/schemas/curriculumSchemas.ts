import { z } from 'zod';

import { CurriculumStatus } from '../enums';

import { idSchema, DefaultFilterSchema } from './sharedSchemas';
import { unitCreateSchema, unitUpdateSchema } from './unitSchemas';

export const curriculumCreateSchema = z.object({
  subjectId: z.uuid().or(z.string()),
  order: z.number().min(0),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.nativeEnum(CurriculumStatus),
  units: z.array(unitCreateSchema),
});

export const curriculumUpdateSchema = curriculumCreateSchema
  .partial()
  .merge(idSchema)
  .merge(
    z.object({
      units: z.array(unitUpdateSchema.omit({ lessons: true })),
    })
  );

export const curriculumFindAllSchema = z
  .object({
    status: z.nativeEnum(CurriculumStatus).optional(),
    subjectIds: z.array(z.string().uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export type CurriculumCreateDto = z.infer<typeof curriculumCreateSchema>;
export type CurriculumUpdateDto = z.infer<typeof curriculumUpdateSchema>;
export type CurriculumFindAllDto = z.infer<typeof curriculumFindAllSchema>;
