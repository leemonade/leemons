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

const {
  getProfiles,
  setProfiles,
  isProfilesConfig,
  findOne,
  update,
} = require('../../core/settings');
const settingsSchema = require('../../models/settings');
const enableMenuItemService = require('../../core/menu-builder/enableItem');
const removeMenuItemService = require('../../core/menu-builder/remove');

/** @type {ServiceSchema} */
module.exports = {
  getProfilesRest: {
    rest: {
      path: '/settings/profiles',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const profiles = await getProfiles({ ctx });
      return { status: 200, profiles };
    },
  },
  setProfilesRest: {
    rest: {
      path: '/settings/profiles',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.profiles': {
          actions: ['create', 'update'],
        },
      }),
    ],
    async handler(ctx) {
      const profiles = await setProfiles({ ...ctx.params, ctx });
      return { status: 200, profiles };
    },
  },
  isProfilesConfigRest: {
    rest: {
      path: '/settings/profiles/is-config',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.profiles': {
          actions: ['view'],
        },
      }),
    ],
    async handler(ctx) {
      const isConfig = await isProfilesConfig({ ctx });
      return { status: 200, isConfig };
    },
  },
  findOneRest: {
    rest: {
      path: '/settings',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.portfolio': {
          actions: ['view'],
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
      path: '/settings',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.portfolio': {
          actions: ['edit'],
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
  enableMenuItemRest: {
    rest: {
      path: '/settings/enable-menu-item',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.portfolio': {
          actions: ['edit'],
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
        const item = await enableMenuItemService({ key: ctx.params.key, ctx });
        return { status: 200, item };
      }
      throw validator.error;
    },
  },
  // TODO @askJaime: Esta acción no tiene ruta.
  // TODO @askJaime: removeMenuItemsService recibe los valores que se prevee que recibirá después de que se migre.
  //! Añadir también permisos si los requiere
  removeMenuItemRest: {
    rest: {
      // path: '/settings/remove-menu-item',
      // method: 'DELETE'? 'PUT?
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: { key: { type: 'string' } },
        required: ['key'],
      });
      if (validator.validate(ctx.params)) {
        const item = await removeMenuItemService({ key: ctx.params.key, ctx });
        return { status: 200, item };
      }
      throw validator.error;
    },
  },
};
