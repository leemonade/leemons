/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const { searchUsers } = require('../../core/users');
const { add, update, detail, remove, list, listDetailPage } = require('../../core/families');

const memberValidation = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      user: { type: 'string' },
      memberType: { type: 'string' },
    },
    required: ['user', 'memberType'],
    additionalProperties: false,
  },
};

const addUpdateFamilySchema = {
  name: { type: 'string' },
  guardians: memberValidation,
  students: memberValidation,
  maritalStatus: { type: 'string' },
  datasetValues: {
    type: 'object',
    additionalProperties: true,
  },
  emergencyPhoneNumbers: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        phone: { type: 'string' },
        relation: { type: 'string' },
        dataset: {
          type: ['object', 'null'],
          additionalProperties: true,
        },
      },
      required: ['name', 'phone', 'relation'],
      additionalProperties: false,
    },
  },
};

/** @type {ServiceSchema} */
module.exports = {
  searchUsersRest: {
    rest: {
      method: 'POST',
      path: '/search-users',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'families.families': {
            actions: ['admin', 'update', 'create'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        profileType: { type: 'string', enum: ['student', 'guardian'] },
        query: {
          type: 'object',
          additionalProperties: true,
        },
      },
      required: ['profileType'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const users = await searchUsers({ ...ctx.params, ctx });
      return { status: 200, users };
    },
  },
  getDatasetFormRest: {
    rest: {
      method: 'GET',
      path: '/dataset-form',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'families.families': {
            actions: ['view', 'update', 'create', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { compileJsonSchema, compileJsonUI } = await ctx.tx.call(
        'dataset.dataset.getSchemaWithLocale',
        {
          locationName: `families-data`,
          pluginName: 'families',
          locale: ctx.meta.userSession.locale,
        }
      );
      return { status: 200, jsonSchema: compileJsonSchema, jsonUI: compileJsonUI };
    },
  },
  addRest: {
    rest: {
      method: 'POST',
      path: '/add',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'families.families': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: addUpdateFamilySchema,
      required: ['name'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const family = await add({ ...ctx.params, ctx });
      return { status: 200, family };
    },
  },
  updateRest: {
    rest: {
      method: 'POST',
      path: '/update',
    },
    params: {
      type: 'object',
      properties: {
        ...addUpdateFamilySchema,
        id: { type: 'string' },
      },
      required: ['id', 'name'],
      additionalProperties: false,
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const family = await update({ ...ctx.params, ctx });
      return { status: 200, family };
    },
  },
  detailRest: {
    rest: {
      method: 'GET',
      path: '/detail/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const family = await detail({ familyId: ctx.params.id, ctx });
      return { status: 200, family };
    },
  },
  removeRest: {
    rest: {
      method: 'DELETE',
      path: '/remove/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'families.families': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const family = await remove({ family: ctx.params.id, ctx });
      return { status: 200, family };
    },
  },
  listRest: {
    rest: {
      method: 'POST',
      path: '/list',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'families.families': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        size: { type: 'number' },
        query: { type: 'object', additionalProperties: true },
      },
      required: ['page', 'size'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const data = await list({ ...ctx.params, ctx });
      return { status: 200, data };
    },
  },
  listDetailPageRest: {
    rest: {
      method: 'GET',
      path: '/list/detail/page/:user',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.users': {
            actions: ['admin', 'view', 'update', 'create', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const data = await listDetailPage({ user: ctx.params.user, ctx });
      return { status: 200, data };
    },
  },
};
