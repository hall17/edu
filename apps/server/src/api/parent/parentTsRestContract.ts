// import { initContract } from '@ts-rest/core';
// import { z } from 'zod';

// import {
//   parentCreateSchema,
//   parentFindAllSchema,
//   parentUpdateSchema,
// } from '../../api/parent/parentModel';
// import { idSchema } from '../../types';

// const c = initContract();

// export const parentContract = c.router({
//   findOne: {
//     method: 'GET',
//     path: '/parent/:id',
//     pathParams: idSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Get a parent by id',
//     metadata: {
//       openApiTags: ['parent'],
//     },
//   },
//   findAll: {
//     method: 'GET',
//     path: '/parent',
//     query: parentFindAllSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Get all parents',
//     metadata: {
//       openApiTags: ['parent'],
//     },
//   },
//   create: {
//     method: 'POST',
//     path: '/parent',
//     body: parentCreateSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Create a parent',
//     metadata: {
//       openApiTags: ['parent'],
//     },
//   },
//   update: {
//     method: 'PUT',
//     path: '/parent/:id',
//     pathParams: idSchema,
//     body: parentUpdateSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Update a parent',
//     metadata: {
//       openApiTags: ['parent'],
//     },
//   },
//   delete: {
//     method: 'DELETE',
//     path: '/parent/:id',
//     pathParams: idSchema,
//     responses: {
//       200: z.string(),
//     },
//     summary: 'Delete a parent',
//     metadata: {
//       openApiTags: ['parent'],
//     },
//   },
// });
