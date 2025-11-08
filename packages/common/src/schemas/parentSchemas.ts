import { z } from 'zod';

import { Gender, UserStatus } from '../enums';
import { idSchema, DefaultFilterSchema } from './sharedSchemas';

export const parentCreateSchema = z.object({
  status: z.nativeEnum(UserStatus).optional(),
  statusUpdateReason: z.string().optional(),
  nationalId: z.string().optional(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  gender: z.nativeEnum(Gender).optional(),
  dateOfBirth: z
    .string()
    .transform((stringDate) => new Date(stringDate))
    .optional(),
  email: z.string().email().max(100),
  profilePictureUrl: z.string().max(255).optional(),
  phoneCountryCode: z.string().max(5).optional(),
  phoneNumber: z.string().max(15).optional(),
  countryCode: z.string().max(2).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  address: z.string().max(255).optional(),
  zipCode: z.string().max(10).optional(),
  about: z.string().max(255).optional(),
  facebookLink: z.string().url().max(255).optional(),
  twitterLink: z.string().url().max(255).optional(),
  instagramLink: z.string().url().max(255).optional(),
  linkedinLink: z.string().url().max(255).optional(),
  studentIds: z.array(z.uuid()),
});

export const parentUpdateSchema = parentCreateSchema.partial().merge(idSchema);

export const parentUpdateSuspendedSchema = z
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

export const parentFindAllSchema = z
  .object({
    status: z.array(z.nativeEnum(UserStatus)).optional(),
    noStudents: z.boolean().optional(),
  })
  .merge(DefaultFilterSchema);

export type ParentCreateDto = z.infer<typeof parentCreateSchema>;
export type ParentUpdateDto = z.infer<typeof parentUpdateSchema>;
export type ParentUpdateSuspendedDto = z.infer<
  typeof parentUpdateSuspendedSchema
>;
export type ParentFindAllDto = z.infer<typeof parentFindAllSchema>;
