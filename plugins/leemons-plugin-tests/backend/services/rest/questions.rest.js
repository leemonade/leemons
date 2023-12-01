/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { getByIds } = require('../../core/questions');

const getDetailsRest = require('./openapi/questions/getDetailsRest');
/** @type {ServiceSchema} */
module.exports = {
  getDetailsRest: {
    openapi: getDetailsRest.openapi,
    rest: {
      method: 'POST',
      path: '/details',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const questions = await getByIds({
        id: ctx.params.questions,
        options: ctx.params.options,
        ctx,
      });
      return { status: 200, questions };
    },
  },
};
