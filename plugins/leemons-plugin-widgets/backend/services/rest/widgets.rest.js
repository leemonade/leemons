/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('leemons-middlewares');

const { get } = require('../../core/widgetZone');

module.exports = {
  getZoneRest: {
    rest: {
      path: '/zone/:key',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const zone = await get({
        key: ctx.params.key,
        userSession: ctx.meta.userSession,
        ctx,
      });
      return { status: 200, zone };
    },
  },
};
