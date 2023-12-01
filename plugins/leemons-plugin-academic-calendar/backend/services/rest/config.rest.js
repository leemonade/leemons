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

const getRest = require('./openapi/config/getRest');
const saveRest = require('./openapi/config/saveRest');
/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    openapi: getRest.openapi,
    rest: {
      method: 'GET',
      path: '/:programId',
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
      const config = await getConfig({
        program: ctx.params.programId,
        ctx,
      });
      return {
        status: 200,
        config,
      };
    },
  },
  saveRest: {
    openapi: saveRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
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
      const config = await saveConfig({
        data: ctx.params,
        ctx,
      });
      return {
        status: 200,
        config,
      };
    },
  },
};
