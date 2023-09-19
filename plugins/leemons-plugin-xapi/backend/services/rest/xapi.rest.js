/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */
const { LeemonsValidator } = require('@leemons/validator');
const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { add } = require('../../core/xapi/statement');

module.exports = {
  addStatementRest: {
    rest: {
      path: '/add/statement',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { type } = ctx.params;
      if (type === 'learning' || type === 'log') {
        let actor = ctx.meta.userSession.userAgents[0].id;
        if (ctx.meta.userSession.userAgents.length > 1) {
          actor = _.map(ctx.meta.userSession.userAgents, 'id');
        }
        await add({ ...ctx.params, actor, ip: ctx.meta.clientIP, ctx });
        return { status: 200 };
      }
      throw new LeemonsError(ctx, { message: 'Only type (learning | log) are available' });
    },
  },
};
