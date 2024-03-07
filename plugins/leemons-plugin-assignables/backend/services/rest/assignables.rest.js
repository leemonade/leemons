/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { getAssignables } = require('../../core/assignables');

/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    rest: {
      method: 'GET',
      path: '/find',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { ids, withFiles, deleted } = ctx.params;
      const idsToUse = Array.isArray(ids) ? ids : [ids];
      const assignables = await getAssignables({
        ids: idsToUse,
        withFiles: withFiles === 'true',
        showDeleted: deleted === 'true',
        ctx,
      });
      return { status: 200, assignables };
    },
  },
};
