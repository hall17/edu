// @ts-nocheck
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  userCreateSchema,
  userFindAllSchema,
  userUpdateSchema,
} from '../../api/user/userModel';
import { idSchema } from '../../types';

const c = initContract();

export const userContract = c.router({
  findOne: {
    method: 'GET',
    path: '/user/:id',
    pathParams: idSchema,
    responses: {
      200: z.any(),
    },
    summary: 'Get a user by id',
    metadata: {
      openApiTags: ['user'],
    },
  },
  findAll: {
    method: 'GET',
    path: '/user',
    query: userFindAllSchema,
    responses: {
      200: z.any(),
    },
    summary: 'Get all users',
    metadata: {
      openApiTags: ['user'],
    },
  },
  create: {
    method: 'POST',
    path: '/user',
    body: userCreateSchema,
    responses: {
      200: z.any(),
    },
    summary: 'Create a user',
    metadata: {
      openApiTags: ['user'],
    },
  },
  update: {
    method: 'PUT',
    path: '/user/:id',
    pathParams: idSchema,
    body: userUpdateSchema,
    responses: {
      200: z.any(),
    },
    summary: 'Update a user',
    metadata: {
      openApiTags: ['user'],
    },
  },
  delete: {
    method: 'DELETE',
    path: '/user/:id',
    pathParams: idSchema,
    responses: {
      200: z.string(),
    },
    summary: 'Delete a user',
    metadata: {
      openApiTags: ['user'],
    },
  },
});
