/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  getTheme,
  getLocales,
  getDefaultLocale,
  getName,
} = require('../../core/platform');

const getPlatformNameRest = require('./openapi/platform/getPlatformNameRest');
const getThemeRest = require('./openapi/platform/getThemeRest');
const getLocalesRest = require('./openapi/platform/getLocalesRest');
const getDefaultLocaleRest = require('./openapi/platform/getDefaultLocaleRest');
/** @type {ServiceSchema} */
module.exports = {
  getPlatformNameRest: {
    openapi: getPlatformNameRest.openapi,
    rest: {
      path: '/name',
      method: 'GET',
    },
    async handler(ctx) {
      const name = await getName({ ctx });
      return { status: 200, name };
    },
  },
  getThemeRest: {
    openapi: getThemeRest.openapi,
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
    openapi: getLocalesRest.openapi,
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
    openapi: getDefaultLocaleRest.openapi,
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
