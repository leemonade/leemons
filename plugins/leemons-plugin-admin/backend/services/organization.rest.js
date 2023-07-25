/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');
const organizationService = require('../core/organization');

/** @type {ServiceSchema} */
module.exports = {
  actions: {
    getRest: {
      rest: {
        method: 'GET',
        path: '/',
      },
      middlewares: [
        LeemonsMiddlewareAuthenticated(),
        LeemonsMiddlewareNecessaryPermits({
          'plugins.permissions.setup': {
            actions: ['admin'],
          },
        }),
      ],
      async handler(ctx) {
        try {
          const organization = await organizationService.getOrganization({
            ctx,
          });
          return {
            status: 200,
            organization,
          };
        } catch (e) {
          console.error(e);
          ctx.meta.$statusCode = 400;
          return { status: 400, error: e.message };
        }
      },
    },
    postRest: {
      rest: {
        method: 'POST',
        path: '/',
      },
      middlewares: [
        LeemonsMiddlewareAuthenticated(),
        LeemonsMiddlewareNecessaryPermits({
          'plugins.permissions.setup': {
            actions: ['admin'],
          },
        }),
      ],
      async handler(ctx) {
        try {
          await organizationService.updateOrganization({
            ...ctx.params,
            ctx,
          });
          return {
            status: 200,
          };
        } catch (e) {
          console.error(e);
          ctx.meta.$statusCode = 400;
          return { status: 400, error: e.message };
        }
      },
    },
    getJsonThemeRest: {
      rest: {
        method: 'GET',
        path: '/jsonTheme',
      },
      async handler(ctx) {
        try {
          const jsonTheme = await organizationService.getJsonTheme({ ctx });
          return {
            status: 200,
            jsonTheme,
          };
        } catch (e) {
          console.error(e);
          ctx.meta.$statusCode = 400;
          return { status: 400, error: e.message };
        }
      },
    },
  },
};
