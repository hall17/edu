import { z } from 'zod';

import { CompanyStatus } from '../enums';
import { intIdSchema, DefaultFilterSchema } from './sharedSchemas';

export const companyCreateSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  status: z.nativeEnum(CompanyStatus),
  logoUrl: z.string().max(255).optional(),
  websiteUrl: z.string().max(255).optional(),
  maximumBranches: z.number().int(),
});

export const companyUpdateSchema = companyCreateSchema
  .partial()
  .extend({
    statusUpdateReason: z.string().optional(),
  })
  .merge(intIdSchema);

export const companyUpdateStatusSchema = z
  .object({
    status: z.nativeEnum(CompanyStatus),
    statusUpdateReason: z.string().optional(),
  })
  .merge(intIdSchema);

export const companyFindAllSchema = z
  .object({
    status: z.array(z.nativeEnum(CompanyStatus)).optional(),
  })
  .merge(DefaultFilterSchema);

export type CompanyCreateDto = z.infer<typeof companyCreateSchema>;
export type CompanyUpdateDto = z.infer<typeof companyUpdateSchema>;
export type CompanyFindAllDto = z.infer<typeof companyFindAllSchema>;
export type CompanyUpdateStatusDto = z.infer<typeof companyUpdateStatusSchema>;
