/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { LeemonsMiddlewareAuthenticated } = require('leemons-middlewares');
const { detail } = require('../../core/users/detail');

module.exports = {
  detailRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const user = await detail({ userId: ctx.userSession.id, ctx });
      return { status: 200, user };
    },
  },
};
