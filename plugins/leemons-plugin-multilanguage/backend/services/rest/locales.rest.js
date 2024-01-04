/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { getAll, add } = require('../../core/locale');

module.exports = {
  addRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    async handler(ctx) {
      try {
        const locale = await add({ ...ctx.params, ctx });
        if (locale) return { locale };
        return { message: 'Locale already exists' };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
  listRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    async handler(ctx) {
      try {
        const locales = await ctx.tx.db.Locales.find({ ctx });
        return { locales };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
  reloadRest: {
    rest: {
      method: 'PUT',
      path: '/',
    },
    async handler(ctx) {
      try {
        const locales = await getAll({ ctx });

        locales.map((locale) => ctx.tx.emit('newLocale', { code: locale.code }));

        return locales;
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
};
