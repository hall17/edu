import { z } from 'zod';

import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const titleCreateSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
});

export const titleUpdateSchema = titleCreateSchema.partial().merge(idSchema);

export const titleFindAllSchema = z
  .object({
    name: z.string().optional(),
  })
  .merge(DefaultFilterSchema);

export type TitleCreateDto = z.infer<typeof titleCreateSchema>;
export type TitleUpdateDto = z.infer<typeof titleUpdateSchema>;
export type TitleFindAllDto = z.infer<typeof titleFindAllSchema>;
