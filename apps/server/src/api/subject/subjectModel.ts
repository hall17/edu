import { SubjectStatus } from '@prisma/client';
import { z } from 'zod';

import { DefaultFilterSchema, idSchema } from '../../types';
import { curriculumCreateSchema } from '../curriculum/curriculumModel';
import { lessonCreateSchema } from '../lesson/lessonModel';

export const subjectCreateSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  curriculums: z
    .array(
      curriculumCreateSchema.pick({ name: true, description: true }).merge(
        z.object({
          lessons: z.array(
            lessonCreateSchema.pick({ name: true, description: true })
          ),
        })
      )
    )
    .optional()
    .default([]),
});

export const subjectUpdateSchema = subjectCreateSchema
  .pick({
    name: true,
    description: true,
  })
  .partial()
  .merge(
    z.object({
      status: z.nativeEnum(SubjectStatus).optional(),
    })
  )
  .merge(idSchema);

export const subjectFindAllSchema = z
  .object({
    status: z.array(z.nativeEnum(SubjectStatus)).optional(),
  })
  .merge(DefaultFilterSchema);

export type SubjectCreateDto = z.infer<typeof subjectCreateSchema>;
export type SubjectUpdateDto = z.infer<typeof subjectUpdateSchema>;
export type SubjectFindAllDto = z.infer<typeof subjectFindAllSchema>;
