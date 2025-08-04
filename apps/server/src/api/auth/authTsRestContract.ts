// import { initContract } from '@ts-rest/core';
// import { z } from 'zod';

// import { loginSchema } from './authModel';
// import { AuthService } from './authService';

// const c = initContract();

// type LoginResponse = Awaited<ReturnType<AuthService['login']>>['user'];

// export const authContract = c.router({
//   login: {
//     method: 'POST',
//     path: '/auth/login',
//     body: loginSchema,
//     responses: {
//       200: c.type<LoginResponse>(),
//       // 200: z.object({
//       //   user: z.object({
//       //     id: z.string(),
//       //     email: z.string(),
//       //     name: z.string(),
//       //   }),
//       // }),
//     },
//     summary: 'Login',
//     metadata: {
//       openApiTags: ['auth'],
//     },
//   },
//   logout: {
//     method: 'POST',
//     path: '/auth/logout',
//     body: null,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Logout',
//     metadata: {
//       openApiTags: ['auth'],
//     },
//   },
//   verify: {
//     method: 'POST',
//     path: '/auth/verify',
//     body: null,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Verify',
//     metadata: {
//       openApiTags: ['auth'],
//     },
//   },
// });

// export type AuthContract = typeof authContract;
