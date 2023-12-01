/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { listGrades } = require('../../core/grades');
const {
  listRules,
  addRule,
  updateRule,
  removeRule,
} = require('../../core/rules');
const { findOne, update } = require('../../core/settings');

const findOneRest = require('./openapi/settings/findOneRest');
const updateRest = require('./openapi/settings/updateRest');
const enableMenuItemRest = require('./openapi/settings/enableMenuItemRest');
/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  findOneRest: {
    openapi: findOneRest.openapi,
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
    openapi: updateRest.openapi,
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
      const data = await update({
        settings: ctx.params,
        ctx,
      });
      return { status: 200, data };
    },
  },
  enableMenuItemRest: {
    openapi: enableMenuItemRest.openapi,
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
