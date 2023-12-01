/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const path = require('path');
const fs = require('fs/promises');

const getLangRest = require('./openapi/i18n/getLangRest');
/** @type {ServiceSchema} */
module.exports = {
  getLangRest: {
    openapi: getLangRest.openapi,
    rest: {
      method: 'GET',
      path: '/:page/:lang',
    },
    async handler(ctx) {
      const { page, lang } = ctx.params;

      try {
        const localeData = await fs.readFile(
          path.resolve(__dirname, `../../i18n/${lang}.json`),
          'utf8'
        );
        const locale = JSON.parse(localeData || null);
        ctx.meta.$statusCode = 200;
        return { status: 200, data: { [lang]: { [page]: locale[page] } } };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
};
