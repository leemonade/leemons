/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const { findOne, update } = require('../../core/settings');

const findOneRest = require('./openapi/settings/findOneRest');
const updateRest = require('./openapi/settings/updateRest');
const enableMenuItemRest = require('./openapi/settings/enableMenuItemRest');
/** @type {ServiceSchema} */
module.exports = {
  findOneRest: {
    openapi: findOneRest.openapi,
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.config': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const settings = await findOne({ ctx });
      return {
        status: 200,
        settings,
      };
    },
  },
  updateRest: {
    openapi: updateRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.config': {
            actions: ['admin', 'edit'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        hideWelcome: {
          type: 'boolean',
        },
        configured: {
          type: 'boolean',
        },
      },
      required: [],
      additionalProperties: false,
    },
    async handler(ctx) {
      const settings = await update({
        settings: ctx.params,
        ctx,
      });
      return { status: 200, settings };
    },
  },
  enableMenuItemRest: {
    openapi: enableMenuItemRest.openapi,
    rest: {
      method: 'POST',
      path: '/enable-menu-item',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.config': {
            actions: ['admin', 'edit'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: { key: { type: 'string' } },
      required: ['key'],
    },
    async handler(ctx) {
      const item = await ctx.tx.call('menu-builder.menuItem.enable', {
        key: ctx.prefixPN(ctx.params.key),
      });
      return { status: 200, item };
    },
  },
};
