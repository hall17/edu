// import { initContract } from '@ts-rest/core';
// import { z } from 'zod';

// import {
//   studentCreateSchema,
//   studentFindAllSchema,
//   studentUpdateSchema,
// } from '../../api/student/studentModel';
// import { idSchema } from '../../types';

// const c = initContract();

// export const studentContract = c.router({
//   findOne: {
//     method: 'GET',
//     path: '/student/:id',
//     pathParams: idSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Get a student by id',
//     metadata: {
//       openApiTags: ['student'],
//     },
//   },
//   findAll: {
//     method: 'GET',
//     path: '/student',
//     query: studentFindAllSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Get all students',
//     metadata: {
//       openApiTags: ['student'],
//     },
//   },
//   create: {
//     method: 'POST',
//     path: '/student',
//     body: studentCreateSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Create a student',
//     metadata: {
//       openApiTags: ['student'],
//     },
//   },
//   update: {
//     method: 'PUT',
//     path: '/student/:id',
//     pathParams: idSchema,
//     body: studentUpdateSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Update a student',
//     metadata: {
//       openApiTags: ['student'],
//     },
//   },
//   delete: {
//     method: 'DELETE',
//     path: '/student/:id',
//     pathParams: idSchema,
//     responses: {
//       200: z.string(),
//     },
//     summary: 'Delete a student',
//     metadata: {
//       openApiTags: ['student'],
//     },
//   },
// });
