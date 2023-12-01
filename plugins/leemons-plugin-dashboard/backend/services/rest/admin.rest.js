/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { getAdminDashboard } = require('../../core/dashboard/getAdminDashboard');
const { getAdminDashboardRealtime } = require('../../core/dashboard/getAdminDashboardRealtime');

const adminRest = require('./openapi/admin/adminRest');
const adminRealtimeRest = require('./openapi/admin/adminRealtimeRest');
/** @type {ServiceSchema} */
module.exports = {
  adminRest: {
    openapi: adminRest.openapi,
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    params: {
      type: 'object',
      properties: {
        start: { type: 'string' },
        end: { type: 'string' },
        program: { type: 'string' },
        center: { type: 'string' },
      },
      additionalProperties: false,
    },
    async handler(ctx) {
      const data = await getAdminDashboard({ config: ctx.params, ctx });
      return { status: 200, data };
    },
  },
  adminRealtimeRest: {
    openapi: adminRealtimeRest.openapi,
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
