/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const { LeemonsValidator } = require('@leemons/validator');
const { findOne, update } = require('../../core/settings');

/** @type {ServiceSchema} */
module.exports = {
  findOneRest: {
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
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
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
        required: ['page', 'size', 'program'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const settings = await update({
          settings: ctx.params,
          ctx,
        });
        return { status: 200, settings };
      }
      throw validator.error;
    },
  },
  enableMenuItemRest: {
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
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: { key: { type: 'string' } },
        required: ['key'],
      });
      if (validator.validate(ctx.params)) {
        const item = await ctx.tx.call('menu-builder.menuItem.enable', {
          key: ctx.prefixPN(ctx.params.key),
        });
        return { status: 200, item };
      }
      throw validator.error;
    },
  },
};
