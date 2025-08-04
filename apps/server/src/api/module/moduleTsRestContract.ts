// @ts-nocheck
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  moduleCreateSchema,
  moduleFindAllSchema,
  moduleUpdateSchema,
} from '../../api/module/moduleModel';
import { intIdSchema } from '../../types';

const c = initContract();

export const moduleContract = c.router({
  findOne: {
    method: 'GET',
    path: '/module/:id',
    pathParams: intIdSchema,
    responses: {
      200: z.any(),
    },
    summary: 'Get a module by id',
    metadata: {
      openApiTags: ['module'],
    },
  },
  findAll: {
    method: 'GET',
    path: '/module',
    query: moduleFindAllSchema,
    responses: {
      200: z.any(),
    },
    summary: 'Get all modules',
    metadata: {
      openApiTags: ['module'],
    },
  },
  create: {
    method: 'POST',
    path: '/module',
    body: moduleCreateSchema,
    responses: {
      200: z.any(),
    },
    summary: 'Create a module',
    metadata: {
      openApiTags: ['module'],
    },
  },
  update: {
    method: 'PUT',
    path: '/module/:id',
    pathParams: intIdSchema,
    body: moduleUpdateSchema,
    responses: {
      200: z.any(),
    },
    summary: 'Update a module',
    metadata: {
      openApiTags: ['module'],
    },
  },
  delete: {
    method: 'DELETE',
    path: '/module/:id',
    pathParams: intIdSchema,
    responses: {
      200: z.object({ success: z.boolean() }),
    },
    summary: 'Delete a module',
    metadata: {
      openApiTags: ['module'],
    },
  },
});
