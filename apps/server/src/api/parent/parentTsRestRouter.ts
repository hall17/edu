// @ts-nocheck
// import { ParentService } from '@api/api/parent/parentService';
// import { authMiddleware } from '@api/middlewares/rest/authMiddleware';
// import { ApiContract } from '@api/ts-rest/apiContract';
// import { RouterImplementation } from '@ts-rest/express/src/lib/types';
// import Container from 'typedi';

// const parentService = Container.get(ParentService);

// export const parentRouterImplementation: RouterImplementation<
//   ApiContract['parent']
// > = {
//   findOne: {
//     middleware: [authMiddleware],
//     handler: async ({ params, req }) => {
//       const parent = await parentService.findOne(req.user, params.id);
//       return {
//         status: 200,
//         body: parent,
//       };
//     },
//   },
//   findAll: {
//     middleware: [authMiddleware],
//     handler: async ({ query, req }) => {
//       const parents = await parentService.findAll(req.user, query);
//       return {
//         status: 200,
//         body: parents,
//       };
//     },
//   },
//   create: {
//     middleware: [authMiddleware],
//     handler: async ({ body, req }) => {
//       const parent = await parentService.create(req.user, body);
//       return {
//         status: 200,
//         body: parent,
//       };
//     },
//   },
//   update: {
//     middleware: [authMiddleware],
//     handler: async ({ params, body, req }) => {
//       const parent = await parentService.update(req.user, {
//         ...body,
//         id: params.id,
//       });
//       return {
//         status: 200,
//         body: parent,
//       };
//     },
//   },
//   delete: {
//     middleware: [authMiddleware],
//     handler: async ({ params, req }) => {
//       const id = await parentService.delete(req.user, params.id);
//       return {
//         status: 200,
//         body: id,
//       };
//     },
//   },
// };
