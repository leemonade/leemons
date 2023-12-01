/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

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
          actions: _actions.includes('admin')
            ? _actions
            : ['admin', ..._actions],
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

const findOneRest = require('./openapi/settings/findOneRest');
const updateRest = require('./openapi/settings/updateRest');
const enableMenuItemRest = require('./openapi/settings/enableMenuItemRest');
/** @type {ServiceSchema} */
module.exports = {
  findOneRest: {
    openapi: findOneRest.openapi,
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
    openapi: updateRest.openapi,
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
      const settings = await update({ settings: ctx.params, ctx });
      return { status: 200, settings };
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
        allowedPermissions: getPermissions(permissions.tasks, ['update']),
      }),
    ],
    params: {
      type: 'object',
      properties: { key: { type: 'string' } },
      required: ['key'],
    },
    async handler(ctx) {
      // To verify: menuKey defaults to mainMenuKey, verificar que es lo que se quiere
      const item = await ctx.tx.call('menu-builder.menuItem.enable', {
        key: ctx.prefixPN(ctx.params.key),
      });
      return { status: 200, item };
    },
  },
  // No route in legacy for removeMenuItem
  // removeMenuItemRest: {
  // },
};
