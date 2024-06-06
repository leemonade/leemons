/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { LeemonsError } = require('@leemons/error');
const organizationService = require('../../core/organization');

/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    rest: {
      method: 'GET',
      path: '/',
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
        const organization = await organizationService.getOrganization({
          ctx,
        });
        return {
          status: 200,
          organization,
        };
      } catch (e) {
        throw new LeemonsError(ctx, { message: e.message, httpStatusCode: 400 });
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
        allowedPermissions: {
          'permissions.setup': {
            actions: ['admin'],
          },
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
        throw new LeemonsError(ctx, { message: e.message, httpStatusCode: 400 });
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
        throw new LeemonsError(ctx, { message: e.message, httpStatusCode: 400 });
      }
    },
  },
};
