/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const configService = require('../../core/config');

module.exports = {
  getConfigRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    async handler(ctx) {
      const configs = await configService.getConfig({
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, configs };
    },
  },
  saveConfigRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
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
