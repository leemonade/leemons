/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { getConfig } = require('../../core/provider');

module.exports = {
  getConfigRest: {
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
