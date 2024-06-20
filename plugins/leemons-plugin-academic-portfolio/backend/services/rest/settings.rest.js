/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsValidator } = require('@leemons/validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const {
  getProfiles,
  setProfiles,
  isProfilesConfig,
  findOne,
  update,
} = require('../../core/settings');
const settingsSchema = require('../../models/settings');

const getProfilesRest = require('./openapi/settings/getProfilesRest');
const setProfilesRest = require('./openapi/settings/setProfilesRest');
const isProfilesConfigRest = require('./openapi/settings/isProfilesConfigRest');
const findOneRest = require('./openapi/settings/findOneRest');
const updateRest = require('./openapi/settings/updateRest');
const enableMenuItemRest = require('./openapi/settings/enableMenuItemRest');
/** @type {ServiceSchema} */
module.exports = {
  getProfilesRest: {
    openapi: getProfilesRest.openapi,
    rest: {
      path: '/profiles',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const profiles = await getProfiles({ ctx });
      return { status: 200, profiles };
    },
  },
  setProfilesRest: {
    openapi: setProfilesRest.openapi,
    rest: {
      path: '/profiles',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.profiles': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const profiles = await setProfiles({ ...ctx.params, ctx });
      return { status: 200, profiles };
    },
  },
  isProfilesConfigRest: {
    openapi: isProfilesConfigRest.openapi,
    rest: {
      path: '/profiles/is-config',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.profiles': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const isConfig = await isProfilesConfig({ ctx });
      return { status: 200, isConfig };
    },
  },
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
          'academic-portfolio.portfolio': {
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
          'academic-portfolio.portfolio': {
            actions: ['admin', 'edit'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: { ...settingsSchema.attributes },
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
  // TODO Verificar que esto se va a usar
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
          'academic-portfolio.portfolio': {
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
  // TODO Verificar que esto se va a usar, la ruta no existía
  // removeMenuItemRest: {
  //   rest: {
  //     // path: '/settings/remove-menu-item',
  //     // method: 'DELETE'? 'PUT?
  //   },
  //   async handler(ctx) {
  //     const validator = new LeemonsValidator({
  //       type: 'object',
  //       properties: { key: { type: 'string' } },
  //       required: ['key'],
  //     });
  //     if (validator.validate(ctx.params)) {
  //       const item = await removeMenuItemService({ key: ctx.params.key, ctx });
  //       return { status: 200, item };
  //     }
  //     throw validator.error;
  //   },
  // },
};
