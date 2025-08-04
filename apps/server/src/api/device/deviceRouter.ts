import { idSchema } from '@api/types';
import Container from 'typedi';

import { protectedProcedure, t } from '../../trpc';

import {
  deviceAssignSchema,
  deviceCreateSchema,
  deviceFindAllSchema,
  deviceFindMyDevicesSchema,
  deviceReturnSchema,
  deviceUpdateSchema,
} from './deviceModel';
import { DeviceService } from './deviceService';

const deviceService = Container.get(DeviceService);

export const deviceRouter = t.router({
  findAll: protectedProcedure
    .input(deviceFindAllSchema)
    .query(async ({ ctx: { req }, input }) => {
      return deviceService.findAll(req.user, input);
    }),
  findOne: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return deviceService.findOne(req.user, input.id);
    }),
  create: protectedProcedure
    .input(deviceCreateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return deviceService.create(req.user, input);
    }),
  update: protectedProcedure
    .input(deviceUpdateSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return deviceService.update(req.user, input);
    }),
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return deviceService.delete(req.user, input.id);
    }),
  assign: protectedProcedure
    .input(deviceAssignSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return deviceService.assignDevice(req.user, input);
    }),
  return: protectedProcedure
    .input(deviceReturnSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return deviceService.returnDevice(req.user, input);
    }),
  findMyDevices: protectedProcedure
    .input(deviceFindMyDevicesSchema)
    .query(async ({ ctx: { req }, input }) => {
      return deviceService.findMyDevices(req.user, input);
    }),
  findMyDevice: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx: { req }, input }) => {
      return deviceService.findMyDevice(req.user, input.id);
    }),
});
