/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const { set } = require('../../core/permissions/set');

/** @type {ServiceSchema} */
module.exports = {
  setRest: {
    rest: {
      method: 'POST',
      path: '/asset/:asset',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { asset, ownerUserAgentIds, ...body } = ctx.params;
      const permissions = await set({ assetId: asset, ...body, ctx });
      return { status: 200, permissions };
    },
  },
};
