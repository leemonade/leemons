/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */
const { LeemonsValidator } = require('leemons-validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');
const {
  list,
  add,
  detailByUri,
  update,
  getProfileSysName,
  addAllPermissionsToAllProfiles,
} = require('../../core/profiles');

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

const translationsValidations = {
  type: 'object',
  properties: {
    name: {
      type: 'object',
      properties: {},
      additionalProperties: true,
    },
    description: {
      type: 'object',
      properties: {},
      additionalProperties: true,
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
        'users.profiles': {
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
      path: '/add',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'users.profiles': {
          actions: ['create', 'admin'],
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          permissions: permissionsValidation,
          translations: translationsValidations,
        },
        required: ['name', 'description', 'permissions'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const profile = await add({ ...ctx.params, ctx });
        return { status: 200, profile };
      }
      throw validator.error;
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
        'users.profiles': {
          actions: ['view', 'update', 'create', 'delete', 'admin'],
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          uri: { type: 'string' },
        },
        required: ['uri'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const profile = await detailByUri({ uri: ctx.params.uri, ctx });
        return { status: 200, profile };
      }
      throw validator.error;
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
        'users.profiles': {
          actions: ['update', 'admin'],
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          permissions: permissionsValidation,
          translations: translationsValidations,
        },
        required: ['id', 'name', 'description', 'permissions'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const profile = await update({ ctx, ...ctx.params });
        return { status: 200, profile };
      }
      throw validator.error;
    },
  },
  getProfileSysNameRest: {
    rest: {
      path: '/sysName',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const sysName = await getProfileSysName({ ctx });
      return { status: 200, sysName };
    },
  },
  addAllPermissionsToAllProfilesRest: {
    rest: {
      path: '/add-all-permissions-to-all-profiles',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      if (process.env.NODE_ENV !== 'production') {
        const profile = await addAllPermissionsToAllProfiles({ ctx });
        return { status: 200, profile };
      }
      return { status: 200, message: 'Disabled in production' };
    },
  },
};
