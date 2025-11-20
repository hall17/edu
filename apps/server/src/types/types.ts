import { TokenUserData } from '@api/api/auth/authService';
import { z } from 'zod';

import { HttpStatus } from '../enums';

// export type TokenUserData = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   name: string;
//   email: string;
//   roles: {
//     id: string;
//     name: string;
//     branchId: number;
//     moduleId?: number;
//     moduleCode?: (typeof MODULE_CODES)[keyof typeof MODULE_CODES];
//   }[];
//   isSuperAdmin: boolean;
//   isAdmin: boolean;
//   isBranchManager: boolean;
//   isModuleManager: boolean;
//   isStaff: boolean;
//   isTeacher: boolean;
//   userType: 'user' | 'student' | 'parent';
//   branchIds: number[];
//   activeBranchId: number;
//   permissions?: string[];
//   preferences?: {
//     theme?: string;
//     language?: string;
//     notificationsEnabled?: boolean;
//   };
// };

export type TokenUser = TokenUserData & {
  type: 'access' | 'refresh';
  jti: string;
};

export type Token = {
  token: string;
  expiresIn: number;
};

export const DefaultFilterSchema = z.object({
  q: z.string().optional(),
  sort: z.string().optional(),
  page: z.number().default(1),
  size: z.number().default(10),
  infiniteScroll: z.boolean().optional().default(false),
  all: z.boolean().optional().default(false),
  global: z.boolean().optional().default(false),
  branchIds: z.array(z.number().int()).optional(),
});

export const idSchema = z.object({
  id: z.string().uuid(),
});

export const intIdSchema = z.object({
  id: z.number().int(),
});

export type LocalizedCustomErrorMessage = {
  en: string;
  tr: string;
};

export type CustomErrorType = {
  status: HttpStatus;
  message: LocalizedCustomErrorMessage;
};

export type VideoQuality = '1080p' | '720p' | '480p' | '360p';
export type VideoProcessingLambdaBody = {
  key: string;
  qualities?: VideoQuality[];
};
