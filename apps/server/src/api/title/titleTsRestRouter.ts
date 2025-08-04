// @ts-nocheck
// import { TitleService } from '@api/api/title/titleService';
// import { authMiddleware } from '@api/middlewares/rest/authMiddleware';
// import { ApiContract } from '@api/ts-rest/apiContract';
// import { RouterImplementation } from '@ts-rest/express/src/lib/types';
// import Container from 'typedi';

// const titleService = Container.get(TitleService);

// export const titleRouterImplementation: RouterImplementation<
//   ApiContract['title']
// > = {
//   findOne: {
//     middleware: [authMiddleware],
//     handler: async ({ params, req }) => {
//       const title = await titleService.findOne(req.user, params.id);
//       return {
//         status: 200,
//         body: title,
//       };
//     },
//   },
//   findAll: {
//     middleware: [authMiddleware],
//     handler: async ({ query, req }) => {
//       const titles = await titleService.findAll(req.user, query);
//       return {
//         status: 200,
//         body: titles,
//       };
//     },
//   },
//   create: {
//     middleware: [authMiddleware],
//     handler: async ({ body, req }) => {
//       const title = await titleService.create(req.user, body);
//       return {
//         status: 200,
//         body: title,
//       };
//     },
//   },
//   update: {
//     middleware: [authMiddleware],
//     handler: async ({ params, body, req }) => {
//       const title = await titleService.update(req.user, {
//         id: params.id,
//         ...body,
//       });
//       return {
//         status: 200,
//         body: title,
//       };
//     },
//   },
//   delete: {
//     middleware: [authMiddleware],
//     handler: async ({ params, req }) => {
//       const result = await titleService.delete(req.user, params.id);
//       return {
//         status: 200,
//         body: result,
//       };
//     },
//   },
// };
