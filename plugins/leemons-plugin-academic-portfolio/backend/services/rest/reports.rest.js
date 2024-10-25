/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const { getColumns } = require('../../core/reports/getColumns');
const { getData } = require('../../core/reports/getData');

/** @type {ServiceSchema} */
module.exports = {
  getColumnsRest: {
    rest: {
      path: '/columns',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const data = await getColumns({ ctx });
      return { status: 200, data };
    },
  },
  getDataRest: {
    rest: {
      path: '/data',
      method: 'GET',
    },
    params: {
      locale: {
        type: 'string',
        optional: true,
      },
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const data = await getData({
        ...ctx.params,
        ctx
      });
      return { status: 200, data };
    },
  },
};
