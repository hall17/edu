// @ts-nocheck
import { ModuleService } from '@api/api/module/moduleService';
import { authMiddleware } from '@api/middlewares/rest/authMiddleware';
import { ApiContract } from '@api/ts-rest/apiContract';
import { RouterImplementation } from '@ts-rest/express/src/lib/types';
import Container from 'typedi';

const moduleService = Container.get(ModuleService);

export const moduleRouterImplementation: RouterImplementation<
  ApiContract['module']
> = {
  findOne: {
    middleware: [authMiddleware],
    handler: async ({ params, req }) => {
      const module = await moduleService.findOne(req.user, params.id);
      return {
        status: 200,
        body: module,
      };
    },
  },
  findAll: {
    middleware: [authMiddleware],
    handler: async ({ query, req }) => {
      const modules = await moduleService.findAll(req.user, query);
      return {
        status: 200,
        body: modules,
      };
    },
  },
  create: {
    middleware: [authMiddleware],
    handler: async ({ body, req }) => {
      const module = await moduleService.create(req.user, body);
      return {
        status: 200,
        body: module,
      };
    },
  },
  update: {
    middleware: [authMiddleware],
    handler: async ({ params, body, req }) => {
      const module = await moduleService.update(req.user, {
        id: params.id,
        ...body,
      });
      return {
        status: 200,
        body: module,
      };
    },
  },
  delete: {
    middleware: [authMiddleware],
    handler: async ({ params, req }) => {
      const result = await moduleService.delete(req.user, params.id);
      return {
        status: 200,
        body: result,
      };
    },
  },
};
