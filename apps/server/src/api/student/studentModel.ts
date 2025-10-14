import {
  Gender,
  StudentStatus,
  UserStatus,
} from '@api/prisma/generated/prisma/client';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { DefaultFilterSchema, idSchema } from '../../types';

export const uploadFileSchema = zfd.formData({
  name: zfd.text(),
  file: zfd.file(),
});

export const studentCreateSchema = z.object({
  status: z.nativeEnum(StudentStatus).optional(),
  statusUpdateReason: z.string().optional(),
  profilePictureUrl: z.string().max(255).optional(),
  parentId: z.string().optional(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email().max(100),
  gender: z.nativeEnum(Gender).optional(),
  dateOfBirth: z
    .string()
    .transform((stringDate) => new Date(stringDate))
    .optional(),
  nationalId: z.string().optional(),
  phoneCountryCode: z.string().max(5).optional(),
  phoneNumber: z.string().max(15).optional(),
  countryCode: z.string().max(2).optional(),
  state: z.string().max(50).optional(),
  city: z.string().max(50).optional(),
  address: z.string().max(255).optional(),
  zipCode: z.string().max(10).optional(),
  about: z.string().max(255).optional(),
  facebookLink: z.string().url().max(255).optional(),
  twitterLink: z.string().url().max(255).optional(),
  instagramLink: z.string().url().max(255).optional(),
  linkedinLink: z.string().url().max(255).optional(),
});

export const studentCreateFromExcelSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email().max(100),
});

export const studentUpdateSchema = studentCreateSchema
  .merge(
    z.object({
      password: z.string().optional(),
      status: z.nativeEnum(StudentStatus).optional(),
    })
  )
  .partial()
  .merge(idSchema);

export const studentUpdateSuspendedSchema = z
  .object({
    id: z.string(),
    status: z.enum([StudentStatus.SUSPENDED]),
    statusUpdateReason: z.string(),
  })
  .or(
    z.object({
      id: z.string(),
      status: z.enum([StudentStatus.ACTIVE]),
    })
  );

export const studentUpdateSignupStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(StudentStatus),
  statusUpdateReason: z.string().optional(),
});

export const studentFindAllSchema = z
  .object({
    status: z.array(z.nativeEnum(UserStatus)).optional(),
    parentId: z.string().optional().nullable(),
    branchIds: z.array(z.string()).optional(),
  })
  .merge(DefaultFilterSchema);

export type StudentCreateDto = z.infer<typeof studentCreateSchema>;
export type StudentUpdateDto = z.infer<typeof studentUpdateSchema>;
export type StudentFindAllDto = z.infer<typeof studentFindAllSchema>;
export type StudentUpdateSuspendedDto = z.infer<
  typeof studentUpdateSuspendedSchema
>;
export type StudentUpdateSignupStatusDto = z.infer<
  typeof studentUpdateSignupStatusSchema
>;
