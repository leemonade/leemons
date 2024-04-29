/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const getRest = require('./openapi/assignations/getRest');
const getManyRest = require('./openapi/assignations/getManyRest');
/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    openapi: getRest.openapi,
    rest: {
      method: 'GET',
      path: '/instance/:instance/user/:user',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { instance, user } = ctx.params;

      const assignations = await ctx.tx.call(
        'assignables.assignations.getAssignation',
        {
          assignableInstanceId: instance,
          user,
        }
      );
      return { status: 200, assignations };
    },
  },
  getManyRest: {
    openapi: getManyRest.openapi,
    rest: {
      method: 'GET',
      path: '/find',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { queries, details, throwOnMissing, fetchInstance } = ctx.params;
      const parsedQueries = (Array.isArray(queries) ? queries : [queries]).map(
        JSON.parse
      );
      const assignations = await ctx.tx.call(
        'assignables.assignations.getAssignations',
        {
          assignationsIds: parsedQueries,
          throwOnMissing: throwOnMissing === 'true',
          details: details === 'true',
          fetchInstance: fetchInstance === 'true',
        }
      );
      return { status: 200, assignations };
    },
  },
};
