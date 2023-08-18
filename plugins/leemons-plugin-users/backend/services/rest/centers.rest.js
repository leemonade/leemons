/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');
const { LeemonsValidator } = require('leemons-validator');
const { list, add, remove } = require('../../core/centers');

module.exports = {
  listRest: {
    rest: {
      path: '/centers',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'users.centers': {
          actions: ['view', 'update', 'create', 'delete', 'admin'],
        },
        'admin.setup': {
          actions: ['view', 'update', 'create', 'delete', 'admin'],
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: 'number' },
          size: { type: 'number' },
          withRoles: {
            anyOf: [
              { type: 'boolean' },
              {
                type: 'object',
                properties: { columns: { type: 'array', items: { type: 'string' } } },
              },
            ],
          },
          withLimits: { type: 'boolean' },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, ...options } = ctx.params;
        const data = await list({ page, size, ...options, ctx });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  addRest: {
    rest: {
      path: '/centers/add',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'users.centers': {
          actions: ['update', 'create', 'delete', 'admin'],
        },
        'admin.setup': {
          actions: ['update', 'create', 'delete', 'admin'],
        },
      }),
    ],
    async handler(ctx) {
      const center = await add({ ...ctx.params, ctx });
      return { status: 200, center };
    },
  },
  removeRest: {
    rest: {
      path: '/centers/remove',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'users.centers': {
          actions: ['delete', 'admin'],
        },
        'admin.setup': {
          actions: ['delete', 'admin'],
        },
      }),
    ],
    async handler(ctx) {
      await remove({ id: ctx.params.id, soft: true, ctx });
      return { status: 200 };
    },
  },
};
