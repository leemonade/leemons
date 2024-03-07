/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */
const nodeFetch = require('node-fetch');

module.exports = {
  todayQuoteRest: {
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
