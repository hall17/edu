import { z } from 'zod';

import { BranchStatus, ModuleStatus } from '../enums';

import { intIdSchema, DefaultFilterSchema } from './sharedSchemas';

export const branchCreateSchema = z.object({
  companyId: z.number().int(),
  slug: z.string().min(1).max(50),
  status: z.nativeEnum(BranchStatus),
  name: z.string().min(1).max(50),
  logoUrl: z.string().max(1000).nullable().optional(),
  location: z.string().max(255).optional(),
  contact: z.string().max(255).optional(),
  canBeDeleted: z.boolean(),
  maximumStudents: z.number().int(),
  statusUpdateReason: z.string().optional().nullable(),
});

export const branchUpdateSchema = branchCreateSchema
  .partial()
  .merge(intIdSchema);

export const branchUpdateMyBranchSchema = branchCreateSchema
  .pick({
    name: true,
    contact: true,
    logoUrl: true,
    location: true,
  })
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
export type BranchUpdateMyBranchDto = z.infer<
  typeof branchUpdateMyBranchSchema
>;
