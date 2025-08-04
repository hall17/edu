import { verifyToken } from '@api/middlewares/trpc';
import Container from 'typedi';

import { protectedProcedure, publicProcedure, t } from '../../trpc';

import {
  changeActiveBranchSchema,
  completeSignupSchema,
  loginSchema,
  resetPasswordSchema,
  sendInvitationEmailSchema,
  sendResetPasswordEmailSchema,
  updateMeSchema,
  updateUserPreferencesSchema,
  verifyTokenSchema,
} from './authModel';
import { AuthService } from './authService';

const authService = Container.get(AuthService);

export const authRouter = t.router({
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx: { res }, input }) => {
      const { cookies, user } = await authService.login(input);
      res.setHeader('Set-Cookie', cookies);
      return user;
    }),
  logout: protectedProcedure.mutation(async ({ ctx: { req, res } }) => {
    const user = await authService.logout(req.user);

    res.setHeader('Set-Cookie', [
      'Authorization=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure;',
      'RefreshToken=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure;',
    ]);
    return user;
  }),
  me: protectedProcedure.mutation(async ({ ctx: { req } }) => {
    return authService.me(req.user);
  }),
  findAttendanceNotifications: protectedProcedure.query(
    async ({ ctx: { req } }) => {
      return authService.findAttendanceNotifications(req.user);
    }
  ),
  updateMe: protectedProcedure
    .input(updateMeSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return authService.updateMe(req, input);
    }),
  updateUserPreferences: protectedProcedure
    .input(updateUserPreferencesSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return authService.updateUserPreferences(req.user, input);
    }),
  changeActiveBranch: protectedProcedure
    .input(changeActiveBranchSchema)
    .mutation(async ({ ctx: { req, res }, input }) => {
      const { cookies, user } = await authService.changeActiveBranch(
        req.user,
        input.branchId
      );
      res.setHeader('Set-Cookie', cookies);
      return user;
    }),
  verifyToken: publicProcedure
    .input(verifyTokenSchema)
    .mutation(async ({ input }) => {
      const user = verifyToken(input.token);
      return authService.verifyToken(user, input);
    }),
  sendResetPasswordEmail: protectedProcedure
    .input(sendResetPasswordEmailSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return authService.sendResetPasswordEmail(req.user, input);
    }),
  sendInvitationEmail: protectedProcedure
    .input(sendInvitationEmailSchema)
    .mutation(async ({ ctx: { req }, input }) => {
      return authService.sendInvitationEmail(req.user, input);
    }),
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
      const user = verifyToken(input.token);
      return authService.resetPassword(user, input);
    }),
  completeSignup: publicProcedure
    .input(completeSignupSchema)
    .mutation(async ({ input }) => {
      const user = verifyToken(input.token);
      return authService.completeSignup(user, input);
    }),
});
