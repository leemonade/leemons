/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { getConfig, saveConfig } = require('../../core/config');
const {
  listRegionalConfigs,
  saveRegionalConfig,
} = require('../../core/regional-config');

const listRest = require('./openapi/regionalConfig/listRest');
const saveRest = require('./openapi/regionalConfig/saveRest');
/** @type {ServiceSchema} */
module.exports = {
  listRest: {
    openapi: listRest.openapi,
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
  saveRest: {
    openapi: saveRest.openapi,
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
