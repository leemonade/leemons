/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { getConfig } = require('../../core/provider');

const getConfigRest = require('./openapi/config/getConfigRest');
/** @type {ServiceSchema} */
module.exports = {
  getConfigRest: {
    openapi: getConfigRest.openapi,
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const isSuperAdmin = await ctx.tx.call('users.users.isSuperAdmin', {
        userId: ctx.meta.userSession.id,
      });

      if (isSuperAdmin) {
        const config = await getConfig({ ctx });
        return { status: 200, config };
      }
      return {
        status: 400,
        error: 'Only can super admin',
      };
    },
  },
};
