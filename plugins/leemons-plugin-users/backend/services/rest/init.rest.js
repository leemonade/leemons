/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const nodeFetch = require('node-fetch');

const todayQuoteRest = require('./openapi/init/todayQuoteRest');
/** @type {ServiceSchema} */
module.exports = {
  todayQuoteRest: {
    openapi: todayQuoteRest.openapi,
    rest: {
      path: '/today-quote',
      method: 'GET',
    },
    async handler() {
      const request = await nodeFetch('https://zenquotes.io/api/today');
      const data = await request.json();
      return { status: 200, data };
    },
  },
};
