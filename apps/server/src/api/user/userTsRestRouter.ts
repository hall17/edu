// // @ts-nocheck
// import { UserService } from '@api/api/user/userService';
// import { authMiddleware } from '@api/middlewares/rest/authMiddleware';
// import { ApiContract } from '@api/ts-rest/apiContract';
// import { RouterImplementation } from '@ts-rest/express/src/lib/types';
// import Container from 'typedi';

// const userService = Container.get(UserService);

// export const userRouterImplementation: RouterImplementation<
//   ApiContract['user']
// > = {
//   findOne: {
//     middleware: [authMiddleware],
//     handler: async ({ params }) => {
//       const user = await userService.findOne(params.id);
//       return {
//         status: 200,
//         body: user,
//       };
//     },
//   },
//   findAll: {
//     middleware: [authMiddleware],
//     handler: async ({ query }) => {
//       const users = await userService.findAll(query);
//       return {
//         status: 200,
//         body: users,
//       };
//     },
//   },
//   create: {
//     middleware: [authMiddleware],
//     handler: async ({ body }) => {
//       const user = await userService.create(body);
//       return {
//         status: 200,
//         body: user,
//       };
//     },
//   },
//   update: {
//     middleware: [authMiddleware],
//     handler: async ({ params, body }) => {
//       const user = await userService.update(params.id, body);
//       return {
//         status: 200,
//         body: user,
//       };
//     },
//   },
//   delete: {
//     middleware: [authMiddleware],
//     handler: async ({ params }) => {
//       const id = await userService.delete(params.id);
//       return {
//         status: 200,
//         body: id,
//       };
//     },
//   },
// };
