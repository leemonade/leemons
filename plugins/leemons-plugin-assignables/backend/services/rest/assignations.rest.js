/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    rest: {
      method: 'GET',
      path: '/instance/:instance/user/:user',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { instance, user } = ctx.params;

      const assignations = await ctx.tx.call('assignables.assignations.getAssignation', {
        assignableInstanceId: instance,
        user,
      });
      return { status: 200, assignations };
    },
  },
  getManyRest: {
    rest: {
      method: 'GET',
      path: '/find',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { queries, details, throwOnMissing, fetchInstance } = ctx.params;
      const parsedQueries = (Array.isArray(queries) ? queries : [queries]).map(JSON.parse);
      const assignations = await ctx.tx.call('assignables.assignations.getAssignations', {
        assignationsIds: parsedQueries,
        throwOnMissing: throwOnMissing === 'true',
        details: details === 'true',
        fetchInstance: fetchInstance === 'true',
      });
      return { status: 200, assignations };
    },
  },
};
