/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');
const { getSystemDataFieldsConfig, saveSystemDataFieldsConfig } = require('../../core/config');

module.exports = {
  getSystemDataFieldsConfigRest: {
    rest: {
      path: '/system-data-fields',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'users.users': {
          actions: ['view', 'update', 'create', 'delete', 'admin'],
        },
      }),
    ],
    async handler(ctx) {
      const config = await getSystemDataFieldsConfig({ ctx });
      return { status: 200, config };
    },
  },
  saveSystemDataFieldsConfigRest: {
    rest: {
      path: '/config/system-data-fields',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'plugins.users.users': {
          actions: ['update', 'create', 'delete', 'admin'],
        },
      }),
    ],
    async handler(ctx) {
      const config = await saveSystemDataFieldsConfig({ ctx, ...ctx.request.body });
      return { status: 200, config };
    },
  },
};
