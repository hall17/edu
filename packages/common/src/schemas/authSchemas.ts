import { z } from 'zod';

import { Gender, Language, Theme, TokenType } from '../enums';
import { userCreateSchema } from './userSchemas';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(32),
});

export const verifyTokenSchema = z.object({
  token: z.string(),
  type: z.nativeEnum(TokenType),
});

export const sendResetPasswordEmailSchema = z.object({
  id: z.string(),
  userType: z.enum(['user', 'student', 'parent']),
});

export const sendInvitationEmailSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  userType: z.enum(['user', 'student', 'parent']),
  roleIds: z.array(z.string()).optional(),
  isResend: z.boolean().optional(),
});

export const sendOtpSmsSchema = z.object({
  id: z.string(),
  userType: z.enum(['user', 'student', 'parent']),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(3).max(32),
});

export const completeSignupSchema = userCreateSchema.merge(
  z.object({
    profilePictureUrl: z.string().max(255).optional(),
    nationalId: z.string(),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email().max(100),
    gender: z.nativeEnum(Gender),
    dateOfBirth: z.string().transform((stringDate) => new Date(stringDate)),
    phoneCountryCode: z.string().max(5),
    phoneNumber: z.string().max(15),
    countryCode: z.string().max(2).optional(),
    city: z.string().max(50),
    state: z.string().max(50).optional(),
    address: z.string().max(255),
    zipCode: z.string().max(10).optional(),
    token: z.string(),
    password: z.string().min(3).max(32).optional(),
  })
);

export const updateMeSchema = z
  .object({
    password: z.string().min(3).max(32).optional(),
  })
  .merge(userCreateSchema)
  .partial();

export const updateUserPreferencesSchema = z
  .object({
    language: z.nativeEnum(Language),
    theme: z.nativeEnum(Theme),
    notificationsEnabled: z.boolean(),
  })
  .partial();

export const changeActiveBranchSchema = z.object({
  branchId: z.number(),
});

export const changePasswordSchema = z.object({
  password: z.string().min(3).max(32),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type UpdateMeDto = z.infer<typeof updateMeSchema>;
export type ChangeActiveBranchDto = z.infer<typeof changeActiveBranchSchema>;
export type UpdateUserPreferencesDto = z.infer<
  typeof updateUserPreferencesSchema
>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type SendResetPasswordEmailDto = z.infer<
  typeof sendResetPasswordEmailSchema
>;
export type SendInvitationEmailDto = z.infer<typeof sendInvitationEmailSchema>;
export type CompleteSignupDto = z.infer<typeof completeSignupSchema>;
export type SendOtpSmsDto = z.infer<typeof sendOtpSmsSchema>;
export type VerifyTokenDto = z.infer<typeof verifyTokenSchema>;

