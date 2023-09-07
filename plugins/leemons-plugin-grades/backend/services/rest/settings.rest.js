/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('leemons-validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');
const { listGrades } = require('../../core/grades');
const { listRules, addRule, updateRule, removeRule } = require('../../core/rules');
const { findOne, update } = require('../../core/settings');

/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  findOneRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'grades.rules': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const settings = await findOne({ ctx });
      return { status: 200, settings };
    },
  },
  updateRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'grades.rules': {
            actions: ['admin', 'edit'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
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
      });
      if (validator.validate(ctx.params)) {
        const data = await update({
          settings: ctx.params,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  enableMenuItemRest: {
    rest: {
      path: '/enable-menu-item',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'grades.rules': {
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
