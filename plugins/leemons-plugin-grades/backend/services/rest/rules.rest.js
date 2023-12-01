/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');

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

const listRulesRest = require('./openapi/rules/listRulesRest');
const haveRulesRest = require('./openapi/rules/haveRulesRest');
const deleteRuleRest = require('./openapi/rules/deleteRuleRest');
const postRuleProcessRest = require('./openapi/rules/postRuleProcessRest');
const postRuleRest = require('./openapi/rules/postRuleRest');
const putRuleRest = require('./openapi/rules/putRuleRest');
/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  listRulesRest: {
    openapi: listRulesRest.openapi,
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    params: {
      type: 'object',
      properties: {
        page: { type: ['number', 'string'] },
        size: { type: ['number', 'string'] },
        center: { type: ['string'] },
      },
      required: ['page', 'size'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const { page, size, center, ...options } = ctx.params;

      const data = await listRules({
        ...options,
        page: parseInt(page, 10),
        size: parseInt(size, 10),
        center,
        ctx,
      });
      return { status: 200, data };
    },
  },
  haveRulesRest: {
    openapi: haveRulesRest.openapi,
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
    openapi: postRuleRest.openapi,
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
    openapi: putRuleRest.openapi,
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
    openapi: deleteRuleRest.openapi,
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
    openapi: postRuleProcessRest.openapi,
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
