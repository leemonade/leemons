/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { getAll, add } = require('../../core/locale');

const addRest = require('./openapi/locales/addRest');
const listRest = require('./openapi/locales/listRest');
/** @type {ServiceSchema} */
module.exports = {
  addRest: {
    openapi: addRest.openapi,
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
    openapi: listRest.openapi,
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
};
