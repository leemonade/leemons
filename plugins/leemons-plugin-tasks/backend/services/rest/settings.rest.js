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

const {
  permissions: { names: permissions },
} = require('../../config/constants');
const { findOne, update } = require('../../core/settings');

const getPermissions = (permissionsArr, actions = null) => {
  if (Array.isArray(permissionsArr)) {
    return permissionsArr.reduce(
      (obj, [permission, _actions]) => ({
        ...obj,
        [permission]: {
          actions: _actions.includes('admin') ? _actions : ['admin', ..._actions],
        },
      }),
      {}
    );
  }
  return {
    [permissionsArr]: {
      actions: actions.includes('admin') ? actions : ['admin', ...actions],
    },
  };
};

/** @type {ServiceSchema} */
module.exports = {
  findOneRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: getPermissions(permissions.tasks, ['view']),
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
        allowedPermissions: getPermissions(permissions.tasks, ['update']),
      }),
    ],
    async handler(ctx) {
      const settingsSchema = {
        hideWelcome: {
          type: 'boolean',
        },
        configured: {
          type: 'boolean',
        },
      };
      const validator = new LeemonsValidator({
        type: 'object',
        properties: { ...settingsSchema },
        required: [],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const settings = await update({ settings: ctx.params, ctx });
        return { status: 200, settings };
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
        allowedPermissions: getPermissions(permissions.tasks, ['update']),
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: { key: { type: 'string' } },
        required: ['key'],
      });
      if (validator.validate(ctx.params)) {
        // To verify: menuKey defaults to mainMenuKey, verificar que es lo que se quiere
        const item = await ctx.tx.call('menu-builder.menuItem.enable', {
          key: ctx.prefixPN(ctx.params.key),
        });
        return { status: 200, item };
      }
      throw validator.error;
    },
  },
  // No route in legacy for removeMenuItem
  // removeMenuItemRest: {
  // },
};
