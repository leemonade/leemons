/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('@leemons/validator');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const {
  list,
  details,
  delete: _delete,
  save,
} = require('../../core/questions-banks');

const listQuestionBanksRest = require('./openapi/questionsBanks/listQuestionBanksRest');
const getQuestionBankDetailRest = require('./openapi/questionsBanks/getQuestionBankDetailRest');
const deleteQuestionBankRest = require('./openapi/questionsBanks/deleteQuestionBankRest');
const saveQuestionBanksRest = require('./openapi/questionsBanks/saveQuestionBanksRest');
/** @type {ServiceSchema} */
module.exports = {
  listQuestionBanksRest: {
    openapi: listQuestionBanksRest.openapi,
    rest: {
      method: 'POST',
      path: '/list',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.questionsBanks': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          published: { type: ['boolean', 'string'] },
          subjects: { type: 'array', items: { type: 'string' } },
          query: { type: 'object', additionalProperties: true },
          includeAgnosticsQB: { type: 'boolean' },
          withAssets: { type: 'boolean' },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const data = await list({
          ...ctx.params,
          page: parseInt(ctx.params.page, 10),
          size: parseInt(ctx.params.size, 10),
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  getQuestionBankDetailRest: {
    openapi: getQuestionBankDetailRest.openapi,
    rest: {
      method: 'GET',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.questionsBanks': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const [questionBank] = await details({ ...ctx.params, ctx });
      return { status: 200, questionBank };
    },
  },
  deleteQuestionBankRest: {
    openapi: deleteQuestionBankRest.openapi,
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.questionsBanks': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      await _delete({ ...ctx.params, ctx });
      return { status: 200 };
    },
  },
  saveQuestionBanksRest: {
    openapi: saveQuestionBanksRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.questionsBanks': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const questionBank = await save({ data: ctx.params, ctx });
      return { status: 200, questionBank };
    },
  },
};
