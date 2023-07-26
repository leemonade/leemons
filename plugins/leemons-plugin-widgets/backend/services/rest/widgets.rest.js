/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

module.exports = {
  getConfigRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    async handler(ctx) {
      return { status: 200, ctx };
    },
  },
};
