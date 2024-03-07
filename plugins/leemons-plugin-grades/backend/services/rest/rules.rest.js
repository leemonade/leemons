/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('@leemons/validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const {
  listRules,
  haveRules,
  addRule,
  updateRule,
  removeRule,
  processRulesForUserAgent,
} = require('../../core/rules');

/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  listRulesRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          center: { type: ['string'] },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });

      if (validator.validate(ctx.params)) {
        const { page, size, center, ...options } = ctx.params;

        const data = await listRules({
          ...options,
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          center,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  haveRulesRest: {
    rest: {
      path: '/have',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const have = await haveRules({ ctx });
      return { status: 200, have };
    },
  },
  postRuleRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const rule = await addRule({ data: ctx.params, ctx });
      return { status: 200, rule };
    },
  },
  putRuleRest: {
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const rule = await updateRule({ data: ctx.params, ctx });
      return { status: 200, rule };
    },
  },
  deleteRuleRest: {
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await removeRule({ id: ctx.params.id, ctx });
      return { status: 200 };
    },
  },
  postRuleProcessRest: {
    rest: {
      path: '/process',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const results = await processRulesForUserAgent({
        ruleIds: ctx.params.rule,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, results };
    },
  },
};
