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
const { getIfHasPermission } = require('../../core/menu');
const {
  addCustomForUser,
  reOrderCustomUserItems,
  removeCustomForUser,
  updateCustomForUser,
} = require('../../core/menu-item');
const {
  validateAddMenuItemFromUser,
  validateReOrder,
  validateRemoveMenuItemFromUser,
  validateUpdateMenuItemFromUser,
} = require('../../validations/menu-item');

/** @type {ServiceSchema} */
module.exports = {
  getIfKnowHowToUseRest: {
    rest: {
      method: 'GET',
      path: '/know-how-to-use',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const knowHowToUse = await ctx.tx.db.KnowHowToUse.countDocuments({
        user: ctx.meta.userSession.id,
      });
      return { status: 200, knowHowToUse: !!knowHowToUse };
    },
  },
  setKnowHowToUseRest: {
    rest: {
      method: 'POST',
      path: '/know-how-to-use',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await ctx.tx.db.KnowHowToUse.create({
        user: ctx.meta.userSession.id,
      });
      return { status: 200, knowHowToUse: true };
    },
  },
  getIfHasPermissionRest: {
    rest: {
      method: 'GET',
      path: '/:menuKey',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const menu = await getIfHasPermission({ ...ctx.params, ctx });
      return { status: 200, menu };
    },
  },
  addCustomForUserRest: {
    rest: {
      method: 'POST',
      path: '/:menuKey/add-item',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      ctx.params.key = ctx.params.menuKey;
      ctx.params.pluginName = ctx.prefixPN('');
      validateAddMenuItemFromUser(ctx.params);
      const menuItem = await addCustomForUser({ ...ctx.params, ctx });
      return { status: 201, menuItem };
    },
  },
  reOrderCustomUserItemsRest: {
    rest: {
      method: 'POST',
      path: '/:menuKey/re-order',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      // TODO: M.FRONTEND BORRAR UNA VEZ MIGRADO EL FRONTEND
      ctx.params.ids = ctx.params.orderedIds;
      delete ctx.params.orderedIds;
      validateReOrder(ctx.params);
      const menuItem = await reOrderCustomUserItems({ ...ctx.params, ctx });
      return { status: 201, menuItem };
    },
  },
  removeCustomForUserRest: {
    rest: {
      method: 'DELETE',
      path: '/:menuKey/:key',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      validateRemoveMenuItemFromUser(ctx.params);
      const menuItem = await removeCustomForUser({ ...ctx.params, ctx });
      return { status: 201, menuItem };
    },
  },
  updateCustomForUserRest: {
    rest: {
      method: 'POST',
      path: '/:menuKey/:key',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      validateUpdateMenuItemFromUser(ctx.params);
      const menuItem = await updateCustomForUser({ ...ctx.params, ctx });
      return { status: 200, menuItem };
    },
  },
};
