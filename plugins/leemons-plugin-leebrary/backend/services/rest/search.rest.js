/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { search } = require('../../core/search');

/** @type {ServiceSchema} */
module.exports = {
  searchRest: {
    rest: {
      path: '/search',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const assets = await search({ ...ctx.params, ctx });
      return { status: 200, assets };
    },
  },
};
