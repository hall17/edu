import { z } from 'zod';

export const DefaultFilterSchema = z.object({
  q: z.string().optional(),
  sort: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
  infiniteScroll: z.boolean().optional(),
  all: z.boolean().optional(),
  global: z.boolean().optional(),
  branchIds: z.array(z.number().int()).optional(),
  detailed: z.boolean().optional(),
});

export const idSchema = z.object({
  id: z.string().uuid(),
});

export const intIdSchema = z.object({
  id: z.number().int(),
});

export type DefaultFilter = z.infer<typeof DefaultFilterSchema>;
