/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { getTheme } = require('../../core/platform');

module.exports = {
  getThemeRest: {
    rest: {
      method: 'GET',
      path: '/theme',
    },
    async handler(ctx) {
      const theme = await getTheme({ ctx });
      return { status: 200, theme };
    },
  },
};
