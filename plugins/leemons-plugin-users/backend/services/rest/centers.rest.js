/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const { list, add, remove } = require('../../core/centers');

const listRest = require('./openapi/centers/listRest');
const addRest = require('./openapi/centers/addRest');
const removeRest = require('./openapi/centers/removeRest');
/** @type {ServiceSchema} */
module.exports = {
  listRest: {
    openapi: listRest.openapi,
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.centers': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
          },
          'admin.setup': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        size: { type: 'number' },
        withRoles: {
          anyOf: [
            { type: 'boolean' },
            {
              type: 'object',
              properties: {
                columns: { type: 'array', items: { type: 'string' } },
              },
            },
          ],
        },
        withLimits: { type: 'boolean' },
      },
      required: ['page', 'size'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const { page, size, ...options } = ctx.params;
      const data = await list({ page, size, ...options, ctx });
      return { status: 200, data };
    },
  },
  addRest: {
    openapi: addRest.openapi,
    rest: {
      path: '/add',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          allowedPermissions: {
            'users.centers': {
              actions: ['update', 'create', 'delete', 'admin'],
            },
            'admin.setup': {
              actions: ['update', 'create', 'delete', 'admin'],
            },
          },
        },
      }),
    ],
    async handler(ctx) {
      const center = await add({ ...ctx.params, ctx });
      return { status: 200, center };
    },
  },
  removeRest: {
    openapi: removeRest.openapi,
    rest: {
      path: '/remove',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.centers': {
            actions: ['delete', 'admin'],
          },
          'admin.setup': {
            actions: ['delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      await remove({ id: ctx.params.id, soft: true, ctx });
      return { status: 200 };
    },
  },
};
