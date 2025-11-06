import { Gender, UserStatus } from '@edusama/common';
import { SYSTEM_ROLES } from '@edusama/common';
import { z } from 'zod';

import { DefaultFilterSchema, idSchema } from '../../types';

export const userCreateSchema = z.object({
  status: z.nativeEnum(UserStatus).optional(),
  statusUpdateReason: z.string().optional(),
  userId: z.string().optional(),
  nationalId: z.string().optional(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email().max(100),
  gender: z.nativeEnum(Gender).optional(),
  dateOfBirth: z
    .string()
    .transform((stringDate) => new Date(stringDate))
    .optional(),
  profilePictureUrl: z.string().max(255).optional(),
  phoneCountryCode: z.string().max(5).optional(),
  phoneNumber: z.string().max(15).optional(),
  branchId: z.number().int().optional(),
  countryCode: z.string().max(2).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  address: z.string().max(255).optional(),
  zipCode: z.string().max(10).optional(),
  facebookLink: z.string().url().max(255).optional(),
  twitterLink: z.string().url().max(255).optional(),
  instagramLink: z.string().url().max(255).optional(),
  linkedinLink: z.string().url().max(255).optional(),
  taughtSubjectIds: z.array(z.string()).optional(),
});

export const userUpdateSchema = z
  .object({
    password: z.string().min(3).max(255).optional(),
  })
  .merge(userCreateSchema)
  .partial()
  .merge(idSchema);

export const userUpdateSuspendedSchema = z
  .object({
    id: z.string(),
    status: z.enum([UserStatus.SUSPENDED]),
    statusUpdateReason: z.string(),
  })
  .or(
    z.object({
      id: z.string(),
      status: z.enum([UserStatus.ACTIVE]),
    })
  );

export const userFindAllSchema = z
  .object({
    status: z.array(z.nativeEnum(UserStatus)).optional(),
    branchIds: z.array(z.number().int()).optional(),
    roleIds: z.array(z.string()).optional(),
    roleCodes: z.array(z.nativeEnum(SYSTEM_ROLES).or(z.string())).optional(),
    isSuperAdmin: z.boolean().optional(),
    isAdmin: z.boolean().optional(),
    isStaff: z.boolean().optional(),
    isTeacher: z.boolean().optional(),
    isParent: z.boolean().optional(),
    isStudent: z.boolean().optional(),
    taughtSubjectIds: z.array(z.string()).optional(),
  })
  .merge(DefaultFilterSchema);

export type UserCreateDto = z.infer<typeof userCreateSchema>;
export type UserUpdateDto = z.infer<typeof userUpdateSchema>;
export type UserUpdateSuspendedDto = z.infer<typeof userUpdateSuspendedSchema>;
export type UserFindAllDto = z.infer<typeof userFindAllSchema>;
