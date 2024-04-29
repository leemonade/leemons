/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { list } = require('../../core/actions');

const listRest = require('./openapi/actions/listRest');
/** @type {ServiceSchema} */
module.exports = {
  listRest: {
    openapi: listRest.openapi,
    rest: {
      path: '/list',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const actions = await list({ ctx });
      return { status: 200, actions };
    },
  },
};
