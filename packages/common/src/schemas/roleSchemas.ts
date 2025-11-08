import { z } from 'zod';

import { RoleStatus } from '../enums';

import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const roleCreateSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  status: z.nativeEnum(RoleStatus).optional(),
  isVisible: z.boolean().optional(),
  isSystem: z.boolean().optional(),
  branchId: z.number().int().optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const roleUpdateSchema = roleCreateSchema.partial().merge(idSchema);

export const roleFindAllSchema = z
  .object({
    status: z.array(z.nativeEnum(RoleStatus)).optional(),
    branchIds: z.array(z.number().int()).optional(),
    isVisible: z.boolean().optional(),
  })
  .merge(DefaultFilterSchema);

export type RoleCreateDto = z.infer<typeof roleCreateSchema>;
export type RoleUpdateDto = z.infer<typeof roleUpdateSchema>;
export type RoleFindAllDto = z.infer<typeof roleFindAllSchema>;
