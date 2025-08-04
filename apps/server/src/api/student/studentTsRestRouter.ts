// // @ts-nocheck
// import { StudentService } from '@api/api/student/studentService';
// import { authMiddleware } from '@api/middlewares/rest/authMiddleware';
// import { ApiContract } from '@api/ts-rest/apiContract';
// import { RouterImplementation } from '@ts-rest/express/src/lib/types';
// import Container from 'typedi';

// const studentService = Container.get(StudentService);

// export const studentRouterImplementation: RouterImplementation<
//   ApiContract['student']
// > = {
//   findOne: {
//     middleware: [authMiddleware],
//     handler: async ({ params, req }) => {
//       const student = await studentService.findOne(req.user, params.id);
//       return {
//         status: 200,
//         body: student,
//       };
//     },
//   },
//   findAll: {
//     middleware: [authMiddleware],
//     handler: async ({ query, req }) => {
//       const students = await studentService.findAll(req.user, query);
//       return {
//         status: 200,
//         body: students,
//       };
//     },
//   },
//   create: {
//     middleware: [authMiddleware],
//     handler: async ({ body, req }) => {
//       const student = await studentService.create(req.user, body);
//       return {
//         status: 200,
//         body: student,
//       };
//     },
//   },
//   update: {
//     middleware: [authMiddleware],
//     handler: async ({ params, body, req }) => {
//       const student = await studentService.update(req.user, {
//         ...body,
//         id: params.id,
//       });
//       return {
//         status: 200,
//         body: student,
//       };
//     },
//   },
//   delete: {
//     middleware: [authMiddleware],
//     handler: async ({ params, req }) => {
//       const id = await studentService.delete(req.user, params.id);
//       return {
//         status: 200,
//         body: id,
//       };
//     },
//   },
// };
