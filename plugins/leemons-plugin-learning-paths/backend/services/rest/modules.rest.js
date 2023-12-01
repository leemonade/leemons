/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const {
  createModule,
  updateModule,
  duplicateModule,
  removeModule,
  publishModule,
  assignModule,
} = require('../../core/modules');

const createRest = require('./openapi/modules/createRest');
const updateRest = require('./openapi/modules/updateRest');
const duplicateRest = require('./openapi/modules/duplicateRest');
const removeRest = require('./openapi/modules/removeRest');
const publishRest = require('./openapi/modules/publishRest');
const assignRest = require('./openapi/modules/assignRest');
/** @type {ServiceSchema} */
module.exports = {
  createRest: {
    openapi: createRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'learning-paths.modules': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { published, ...module } = ctx.params;
      const createdModule = await createModule({ module, published, ctx });
      return { status: 200, module: createdModule };
    },
  },
  updateRest: {
    openapi: updateRest.openapi,
    rest: {
      method: 'PUT',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'learning-paths.modules': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { id, published, ...module } = ctx.params;
      const updatedModule = await updateModule({ id, module, published, ctx });
      return { status: 200, module: updatedModule };
    },
  },
  duplicateRest: {
    openapi: duplicateRest.openapi,
    rest: {
      method: 'POST',
      path: '/:id/duplicate',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'learning-paths.modules': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { id, published } = ctx.params;
      const duplicatedModule = await duplicateModule({
        id,
        published: _.isBoolean(published) ? published : published === 'true',
        ctx,
      });
      return { status: 200, module: duplicatedModule };
    },
  },
  removeRest: {
    openapi: removeRest.openapi,
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'learning-paths.modules': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { id } = ctx.params;
      const deleted = await removeModule({
        id,
        ctx,
      });
      return { status: 200, ...deleted };
    },
  },
  publishRest: {
    openapi: publishRest.openapi,
    rest: {
      method: 'POST',
      path: '/:id/publish',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'learning-paths.modules': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { id } = ctx.params;
      const published = await publishModule({
        id,
        ctx,
      });
      return { status: 200, published };
    },
  },
  assignRest: {
    openapi: assignRest.openapi,
    rest: {
      method: 'POST',
      path: '/:id/assign',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'learning-paths.modules': {
            actions: ['admin', 'assign'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { id, activities, assignationForm } = ctx.params;
      const assignation = await assignModule({
        moduleId: id,
        config: { activities, assignationForm },
        ctx,
      });
      return { status: 200, assignation };
    },
  },
};
