/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { getAll } = require('../core/locale');

module.exports = {
  actions: {
    addRest: {
      rest: {
        method: 'GET',
        path: '/',
      },
      async handler(ctx) {
        try {
          const locales = await getAll({ ctx });
          return { locales };
        } catch (e) {
          ctx.meta.$statusCode = 400;
          return { status: 400, error: e.message };
        }
      },
    },
  },
};
