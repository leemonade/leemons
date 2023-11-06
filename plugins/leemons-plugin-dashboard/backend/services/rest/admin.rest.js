/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { LeemonsValidator } = require('@leemons/validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { getAdminDashboard } = require('../../core/dashboard/getAdminDashboard');
const { getAdminDashboardRealtime } = require('../../core/dashboard/getAdminDashboardRealtime');

module.exports = {
  adminRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          start: { type: 'string' },
          end: { type: 'string' },
          program: { type: 'string' },
          center: { type: 'string' },
        },
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const data = await getAdminDashboard({ config: ctx.params, ctx });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  adminRealtimeRest: {
    rest: {
      method: 'GET',
      path: '/realtime',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await getAdminDashboardRealtime();
      return { status: 200, data };
    },
  },
};
