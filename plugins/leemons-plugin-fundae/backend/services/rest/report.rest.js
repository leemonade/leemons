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
const { generate, retry, listReports } = require('../../core/report');

/** @type {ServiceSchema} */
module.exports = {
  generateRest: {
    rest: {
      method: 'POST',
      path: '/add',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'fundae.fundae': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const reports = await generate({
        userAgent: ctx.params.userAgents,
        program: ctx.params.program,
        course: ctx.params.course,
        ctx,
      });
      return { status: 200, reports };
    },
  },
  retryRest: {
    rest: {
      method: 'POST',
      path: '/retry',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'fundae.fundae': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      await retry({
        id: ctx.params.id,
        ctx,
      });
      return { status: 200 };
    },
  },
  listRest: {
    rest: {
      method: 'POST',
      path: '/list',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'fundae.fundae': {
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
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const data = await listReports({
          page: parseInt(ctx.params.page, 10),
          size: parseInt(ctx.params.size, 10),
          filters: ctx.params.filters,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
};
