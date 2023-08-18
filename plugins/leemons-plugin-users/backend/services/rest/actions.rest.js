/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */
const { LeemonsMiddlewareAuthenticated } = require('leemons-middlewares');
const { list } = require('../../core/actions');

module.exports = {
  listRest: {
    rest: {
      path: '/action/list',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const actions = await list({ ctx });
      return { status: 200, actions };
    },
  },
};
