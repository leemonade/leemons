/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const configService = require('../../core/config');

const getConfigRest = require('./openapi/config/getConfigRest');
const saveConfigRest = require('./openapi/config/saveConfigRest');
/** @type {ServiceSchema} */
module.exports = {
  getConfigRest: {
    openapi: getConfigRest.openapi,
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const configs = await configService.getConfig({
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, configs };
    },
  },
  saveConfigRest: {
    openapi: saveConfigRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const configs = await configService.saveConfig({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, configs };
    },
  },
};
