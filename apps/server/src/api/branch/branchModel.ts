import {
  BranchStatus,
  ModuleStatus,
} from '@api/prisma/generated/prisma/client';
import { z } from 'zod';

import { DefaultFilterSchema, intIdSchema } from '../../types';

export const branchCreateSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  location: z.string().optional(),
  contact: z.string().optional(),
  status: z.nativeEnum(BranchStatus).default(BranchStatus.ACTIVE),
  canBeDeleted: z.boolean().default(true),
  statusUpdateReason: z.string().optional(),
  companyId: z.number().int(),
});

export const branchUpdateSchema = branchCreateSchema
  .partial()
  .merge(intIdSchema);

export const branchFindAllSchema = z
  .object({
    status: z.array(z.nativeEnum(BranchStatus)).optional(),
    companyIds: z.array(z.number().int()).optional(),
  })
  .merge(DefaultFilterSchema);

export const moduleUpdateStatusSchema = z.object({
  moduleId: z.number().int(),
  status: z.nativeEnum(ModuleStatus),
});

export const branchUpdateStatusSchema = z.object({
  id: z.number().int(),
  status: z.nativeEnum(BranchStatus),
  statusUpdateReason: z.string().optional().nullable(),
});

export type BranchCreateDto = z.infer<typeof branchCreateSchema>;
export type BranchUpdateDto = z.infer<typeof branchUpdateSchema>;
export type BranchFindAllDto = z.infer<typeof branchFindAllSchema>;
export type ModuleUpdateStatusDto = z.infer<typeof moduleUpdateStatusSchema>;
export type BranchUpdateStatusDto = z.infer<typeof branchUpdateStatusSchema>;
