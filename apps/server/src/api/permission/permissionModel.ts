import { z } from 'zod';

import { DefaultFilterSchema, idSchema } from '../../types';

export const permissionCreateSchema = z.object({
  name: z.string().min(1).max(100),
  moduleId: z.number().int().positive(),
});

export const permissionUpdateSchema = permissionCreateSchema
  .partial()
  .merge(idSchema);

export const permissionFindAllSchema = z
  .object({
    moduleId: z.number().int().positive().optional(),
    name: z.string().optional(),
  })
  .merge(DefaultFilterSchema);

export const assignPermissionsToRoleSchema = z.object({
  roleId: z.string().uuid(),
  permissionIds: z.array(z.string().uuid()),
});

export const removePermissionsFromRoleSchema = z.object({
  roleId: z.string().uuid(),
  permissionIds: z.array(z.string().uuid()),
});

export type PermissionCreateDto = z.infer<typeof permissionCreateSchema>;
export type PermissionUpdateDto = z.infer<typeof permissionUpdateSchema>;
export type PermissionFindAllDto = z.infer<typeof permissionFindAllSchema>;
export type AssignPermissionsToRoleDto = z.infer<
  typeof assignPermissionsToRoleSchema
>;
export type RemovePermissionsFromRoleDto = z.infer<
  typeof removePermissionsFromRoleSchema
>;
