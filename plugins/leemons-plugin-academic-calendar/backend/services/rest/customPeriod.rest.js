/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const {
  remove,
  getByItem,
  getByItems,
  assignCustomPeriodToItems,
  setItem,
} = require('../../core/customPeriods');

const ITEM_PATH = '/item';

/** @type {ServiceSchema} */
module.exports = {
  setItemRest: {
    rest: {
      method: 'POST',
      path: `${ITEM_PATH}`,
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const customPeriod = await setItem({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        data: customPeriod,
      };
    },
  },
  assignToItemsRest: {
    rest: {
      method: 'POST',
      path: `${ITEM_PATH}`,
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const customPeriods = await assignCustomPeriodToItems({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        data: customPeriods,
      };
    },
  },
  getByItemRest: {
    rest: {
      method: 'GET',
      path: `${ITEM_PATH}/:item`,
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const customPeriod = await getByItem({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        data: customPeriod,
      };
    },
  },
  getByItemsRest: {
    rest: {
      method: 'POST',
      path: `${ITEM_PATH}/get-many`,
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const customPeriod = await getByItems({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        data: customPeriod,
      };
    },
  },
  removeByItemRest: {
    rest: {
      method: 'DELETE',
      path: `${ITEM_PATH}/:item`,
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const result = await remove({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        data: result,
      };
    },
  },
};
