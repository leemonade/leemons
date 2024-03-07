/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
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
    async handler(ctx) {
      const validator = new LeemonsValidator({
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
      });
      if (validator.validate(ctx.params)) {
        const users = await searchUsers({ ...ctx.params, ctx });
        return { status: 200, users };
      }
      throw validator.error;
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
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: addUpdateFamilySchema,
        required: ['name'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const family = await add({ ...ctx.params, ctx });
        return { status: 200, family };
      }
      throw validator.error;
    },
  },
  updateRest: {
    rest: {
      method: 'POST',
      path: '/update',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          ...addUpdateFamilySchema,
          id: { type: 'string' },
        },
        required: ['id', 'name'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const family = await update({ ...ctx.params, ctx });
        return { status: 200, family };
      }
      throw validator.error;
    },
  },
  detailRest: {
    rest: {
      method: 'GET',
      path: '/detail/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const family = await detail({ familyId: ctx.params.id, ctx });
        return { status: 200, family };
      }
      throw validator.error;
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
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const family = await remove({ family: ctx.params.id, ctx });
        return { status: 200, family };
      }
      throw validator.error;
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
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: 'number' },
          size: { type: 'number' },
          query: { type: 'object', additionalProperties: true },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const data = await list({ ...ctx.params, ctx });
        return { status: 200, data };
      }
      throw validator.error;
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
