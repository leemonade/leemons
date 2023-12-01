/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const organizationService = require('../../core/organization');

const getRest = require('./openapi/organization/getRest');
const postRest = require('./openapi/organization/postRest');
const getJsonThemeRest = require('./openapi/organization/getJsonThemeRest');
/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    openapi: getRest.openapi,
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
        console.error(e);
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
  postRest: {
    openapi: postRest.openapi,
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
        console.error(e);
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
  getJsonThemeRest: {
    openapi: getJsonThemeRest.openapi,
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
};
