import {
  AssignmentStatus,
  DeviceCondition,
  DeviceStatus,
  DeviceType,
} from '@edusama/common';
import { z } from 'zod';

import { DefaultFilterSchema, idSchema } from '../../types';

export const deviceCreateSchema = z.object({
  serialNumber: z.string().min(1).max(100),
  assetTag: z.string().max(50).optional(),
  deviceType: z.nativeEnum(DeviceType),
  brand: z.string().min(1).max(50),
  model: z.string().min(1).max(100),
  specifications: z.string().optional(),
  purchaseDate: z.date().optional(),
  warrantyExpiry: z.date().optional(),
  purchasePrice: z.number().positive().optional(),
  purchaseCurrency: z.string().max(10).optional(),
  supplier: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  status: z.nativeEnum(DeviceStatus).default(DeviceStatus.AVAILABLE),
  condition: z.nativeEnum(DeviceCondition).default(DeviceCondition.NEW),
  notes: z.string().optional(),
  branchId: z.number().int(),
});

export const deviceUpdateSchema = deviceCreateSchema.partial().merge(idSchema);

export const deviceFindAllSchema = z
  .object({
    userIds: z.array(z.string().uuid()).optional(),
    deviceType: z.array(z.nativeEnum(DeviceType)).optional(),
    status: z.array(z.nativeEnum(DeviceStatus)).optional(),
    condition: z.array(z.nativeEnum(DeviceCondition)).optional(),
    branchIds: z.array(z.number().int()).optional(),
  })
  .merge(DefaultFilterSchema);

export const deviceAssignSchema = z.object({
  deviceId: z.string().uuid(),
  userId: z.string().uuid(),
  expectedReturnAt: z.date().optional(),
  assignmentNotes: z.string().optional(),
  conditionAtAssignment: z.nativeEnum(DeviceCondition).optional(),
});

export const deviceReturnSchema = z.object({
  assignmentId: z.string().uuid(),
  returnNotes: z.string().optional(),
  conditionAtReturn: z.nativeEnum(DeviceCondition).optional(),
});

export const deviceFindMyDevicesSchema = z
  .object({
    status: z.array(z.nativeEnum(AssignmentStatus)).optional(),
    deviceType: z.array(z.nativeEnum(DeviceType)).optional(),
    condition: z.array(z.nativeEnum(DeviceCondition)).optional(),
    deviceId: z.string().uuid().optional(),
  })
  .merge(DefaultFilterSchema);

export type DeviceCreateDto = z.infer<typeof deviceCreateSchema>;
export type DeviceUpdateDto = z.infer<typeof deviceUpdateSchema>;
export type DeviceFindAllDto = z.infer<typeof deviceFindAllSchema>;
export type DeviceAssignDto = z.infer<typeof deviceAssignSchema>;
export type DeviceReturnDto = z.infer<typeof deviceReturnSchema>;
export type DeviceFindMyDevicesDto = z.infer<typeof deviceFindMyDevicesSchema>;
