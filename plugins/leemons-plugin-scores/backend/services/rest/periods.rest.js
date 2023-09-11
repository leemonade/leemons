/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('leemons-validator');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');

const addPeriod = require('../../core/periods/addPeriod');
const listPeriods = require('../../core/periods/listPeriods');
const removePeriod = require('../../core/periods/removePeriod');

/** @type {ServiceSchema} */
module.exports = {
  addRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'scores.periods': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const savedPeriod = await addPeriod({ ...ctx.params, ctx });
      return { status: 200, savedPeriod };
    },
  },
  listRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'scores.periods': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { query } = ctx.params;
      const q = Object.fromEntries(
        Object.entries(query).map(([key, value]) => {
          try {
            const jsonValue = JSON.parse(value);

            return [key, jsonValue];
          } catch (e) {
            return [key, value];
          }
        })
      );
      const periods = await listPeriods({ ...q, ctx });
      return { status: 200, periods };
    },
  },
  removeRest: {
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'scores.periods': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const period = await removePeriod({ periodId: parseInt(ctx.params.id, 10), ctx });
      return { status: 200, period };
    },
  },
};
