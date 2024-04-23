/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const {
  listRegionalConfigs,
  saveRegionalConfig,
  deleteRegionalConfig,
} = require('../../core/regional-config');

/** @type {ServiceSchema} */
module.exports = {
  listRest: {
    rest: {
      method: 'GET',
      path: '/list/:center',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const regionalConfigs = await listRegionalConfigs({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        regionalConfigs,
      };
    },
  },
  deleteRest: {
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const result = await deleteRegionalConfig({
        id: ctx.params.id,
        ctx,
      });
      return {
        status: 200,
        result,
      };
    },
  },
  saveRest: {
    rest: {
      method: 'POST',
      path: '/save',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const regionalConfig = await saveRegionalConfig({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        regionalConfig,
      };
    },
  },
};
