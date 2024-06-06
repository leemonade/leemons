const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const { escapeRegExp } = require('lodash');
const addPeriod = require('../../core/periods/addPeriod');
const listPeriods = require('../../core/periods/listPeriods');
const removePeriod = require('../../core/periods/removePeriod');

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
      const q = Object.fromEntries(
        Object.entries(ctx.params).map(([key, value]) => {
          try {
            const jsonValue = JSON.parse(value);

            return [key, jsonValue];
          } catch (e) {
            return [key, value];
          }
        })
      );
      // eslint-disable-next-line no-prototype-builtins
      if (q.hasOwnProperty('name_$contains')) {
        q.name = { $regex: `.*${escapeRegExp(q.name_$contains)}.*`, $options: 'i' };
        delete q.name_$contains;
      }
      const periods = await listPeriods({ ...q, ctx });
      return { status: 200, data: periods };
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
