/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { getTheme, getLocales, getDefaultLocale } = require('../../core/platform');

module.exports = {
  getThemeRest: {
    rest: {
      path: '/theme',
      method: 'GET',
    },
    async handler(ctx) {
      const theme = await getTheme({ ctx });
      return { status: 200, theme };
    },
  },
  getLocalesRest: {
    rest: {
      path: '/locales',
      method: 'GET',
    },
    async handler(ctx) {
      const locales = await getLocales({ ctx });
      return { status: 200, locales };
    },
  },
  getDefaultLocaleRest: {
    rest: {
      path: '/default-locale',
      method: 'GET',
    },
    async handler(ctx) {
      const locale = await getDefaultLocale({ ctx });
      return { status: 200, locale };
    },
  },
};
