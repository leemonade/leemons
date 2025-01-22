/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const { remove, getByItem, create, update, getByItems } = require('../../core/customPeriods');

const ITEM_PATH = '/item';

/** @type {ServiceSchema} */
module.exports = {
  createRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const customPeriod = await create({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        data: customPeriod,
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
      path: `${ITEM_PATH}/getMany`,
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
  updateByItemRest: {
    rest: {
      method: 'PUT',
      path: `${ITEM_PATH}/:item`,
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-calendar.config': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const customPeriod = await update({
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
