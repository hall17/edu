import { UserStatus } from '@edusama/server';
import { z } from 'zod';

export const localizedCustomErrorMessageSchema = z.object({
  en: z.string(),
  tr: z.string(),
});

export type LocalizedCustomErrorMessage = z.infer<
  typeof localizedCustomErrorMessageSchema
>;

export const defaultFilterSchema = z.object({
  q: z.string().optional(),
  sort: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

// export const Gender = {
//   MALE: 'MALE',
//   FEMALE: 'FEMALE',
//   OTHER: 'OTHER',
// } as const;

// export type Gender = (typeof Gender)[keyof typeof Gender];

// export const UserStatus = {
//   ACTIVE: 'ACTIVE',
//   SUSPENDED: 'SUSPENDED',
// } as const;

// export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// export const Language = {
//   ENGLISH: 'ENGLISH',
//   FRENCH: 'FRENCH',
//   JAPANESE: 'JAPANESE',
//   SPANISH: 'SPANISH',
//   TURKISH: 'TURKISH',
// } as const;

// export type Language = (typeof Language)[keyof typeof Language];

// export const Theme = {
//   LIGHT: 'LIGHT',
//   DARK: 'DARK',
// } as const;

// export type Theme = (typeof Theme)[keyof typeof Theme];

export const userFindAllSchema = z
  .object({ status: z.array(z.nativeEnum(UserStatus)).optional() })
  .merge(defaultFilterSchema);

export const NotificationType = {
  ATTENDANCE_VIOLATION: 'ATTENDANCE_VIOLATION',
  REMINDER: 'REMINDER',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationStatus = {
  SENT: 'SENT',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
} as const;

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export interface Notification {
  id: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  notificationDate: Date;
  status: NotificationStatus;
  acknowledgedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationResponse {
  data: Notification[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
