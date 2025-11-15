import { z } from 'zod';

import { SubjectStatus } from '../enums';

import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const subjectCreateSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  status: z.nativeEnum(SubjectStatus),
});

export const subjectUpdateSchema = subjectCreateSchema
  .partial()
  .merge(idSchema);

export const subjectFindAllSchema = z
  .object({
    status: z.array(z.nativeEnum(SubjectStatus)).optional(),
  })
  .merge(DefaultFilterSchema);

export type SubjectCreateDto = z.infer<typeof subjectCreateSchema>;
export type SubjectUpdateDto = z.infer<typeof subjectUpdateSchema>;
export type SubjectFindAllDto = z.infer<typeof subjectFindAllSchema>;
