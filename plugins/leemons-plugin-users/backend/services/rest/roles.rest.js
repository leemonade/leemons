/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const groupsService = require('../../core/groups');

const permissionsValidation = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      permissionName: {
        type: 'string',
      },
      actionNames: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
};

module.exports = {
  listRest: {
    rest: {
      path: '/list',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.roles': {
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
      },
      required: ['page', 'size'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const { page, size } = ctx.params;
      const data = await groupsService.list({ page, size, ctx });
      return { status: 200, data };
    },
  },
  detailRest: {
    rest: {
      path: '/detail/:uri',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.roles': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        uri: { type: 'string' },
      },
      required: ['uri'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const role = await groupsService.detailByUri({ uri: ctx.params.uri, ctx });
      return { status: 200, role };
    },
  },
  addRest: {
    rest: {
      path: '/add',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.roles': {
            actions: ['create', 'admin'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        permissions: permissionsValidation,
      },
      required: ['name', 'description', 'permissions'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const role = await groupsService.addWithRole({ ...ctx.params, ctx });
      return { status: 200, role };
    },
  },
  updateRest: {
    rest: {
      path: '/update',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.roles': {
            actions: ['update', 'admin'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        permissions: permissionsValidation,
        userAgents: { type: 'array', items: { type: 'string' } },
      },
      required: ['id', 'name', 'description', 'permissions'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const role = await groupsService.updateWithRole({ ...ctx.params, ctx });
      return { status: 200, role };
    },
  },
};
