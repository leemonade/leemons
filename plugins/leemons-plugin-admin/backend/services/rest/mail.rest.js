/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');

/** @type {ServiceSchema} */
module.exports = {
  getProvidersRest: {
    rest: {
      method: 'GET',
      path: '/providers',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'permissions.setup': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      try {
        const providers = await ctx.tx.call('emails.email.providers');
        return { status: 200, providers };
      } catch (e) {
        console.error(e);
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
  getPlatformEmailRest: {
    rest: {
      method: 'GET',
      path: '/platform',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'permissions.setup': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      try {
        const email = await ctx.tx.call('users.platform.getEmail');
        return { status: 200, email };
      } catch (e) {
        console.error(e);
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
  savePlatformEmailRest: {
    rest: {
      method: 'POST',
      path: '/platform',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'permissions.setup': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      try {
        const email = await ctx.tx.call('users.platform.setEmail', { value: ctx.params.email });
        return { status: 200, email };
      } catch (e) {
        console.error(e);
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
};
