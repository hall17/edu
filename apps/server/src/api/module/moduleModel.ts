import { ModuleStatus } from '@api/prisma/generated/prisma/client';
import { z } from 'zod';

import { DefaultFilterSchema, intIdSchema } from '../../types';

export const moduleCreateSchema = z.object({
  code: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  version: z.string().max(50).default('1.0.0'),
  status: z.nativeEnum(ModuleStatus).default(ModuleStatus.ACTIVE),
  canBeDeleted: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export const moduleUpdateSchema = moduleCreateSchema
  .partial()
  .merge(intIdSchema);

export const moduleFindAllSchema = z
  .object({
    branchId: z.number().optional(),
    codes: z.array(z.string()).optional(),
    status: z.array(z.nativeEnum(ModuleStatus)).optional(),
    canBeDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    branchModules: z.boolean().optional(),
  })
  .merge(DefaultFilterSchema);

export type ModuleCreateDto = z.infer<typeof moduleCreateSchema>;
export type ModuleUpdateDto = z.infer<typeof moduleUpdateSchema>;
export type ModuleFindAllDto = z.infer<typeof moduleFindAllSchema>;
