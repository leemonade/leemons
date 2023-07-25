/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const path = require('path');
const fs = require('fs/promises');

module.exports = {
  getLangRest: {
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
        const locale = JSON.parse(localeData);
        ctx.meta.$statusCode = 200;
        return { status: 200, data: { [lang]: { [page]: locale[page] } } };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
};
