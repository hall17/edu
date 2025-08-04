// import { initContract } from '@ts-rest/core';
// import { z } from 'zod';

// import {
//   titleCreateSchema,
//   titleFindAllSchema,
//   titleUpdateSchema,
// } from '../../api/title/titleModel';
// import { idSchema } from '../../types';

// const c = initContract();

// export const titleContract = c.router({
//   findOne: {
//     method: 'GET',
//     path: '/title/:id',
//     pathParams: idSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Get a title by id',
//     metadata: {
//       openApiTags: ['title'],
//     },
//   },
//   findAll: {
//     method: 'GET',
//     path: '/title',
//     query: titleFindAllSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Get all titles',
//     metadata: {
//       openApiTags: ['title'],
//     },
//   },
//   create: {
//     method: 'POST',
//     path: '/title',
//     body: titleCreateSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Create a title',
//     metadata: {
//       openApiTags: ['title'],
//     },
//   },
//   update: {
//     method: 'PUT',
//     path: '/title/:id',
//     pathParams: idSchema,
//     body: titleUpdateSchema,
//     responses: {
//       200: z.any(),
//     },
//     summary: 'Update a title',
//     metadata: {
//       openApiTags: ['title'],
//     },
//   },
//   delete: {
//     method: 'DELETE',
//     path: '/title/:id',
//     pathParams: idSchema,
//     responses: {
//       200: z.string(),
//     },
//     summary: 'Delete a title',
//     metadata: {
//       openApiTags: ['title'],
//     },
//   },
// });
