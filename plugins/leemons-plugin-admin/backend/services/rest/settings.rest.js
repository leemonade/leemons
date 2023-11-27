/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const settingsService = require('../../core/settings');

/** @type {ServiceSchema} */
module.exports = {
  findOneRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    async handler(ctx) {
      const settings = await settingsService.findOne({ ctx });
      return { status: 200, settings };
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
          'permissions.setup': {
            actions: ['admin'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        configured: {
          type: 'boolean',
        },
        status: {
          type: 'string',
        },
        lang: {
          type: 'string',
        },
      },
      required: [],
      additionalProperties: false,
    },
    async handler(ctx) {
      const settings = await settingsService.update({ ...ctx.params, ctx });
      return { status: 200, settings };
    },
  },
  signupRest: {
    rest: {
      method: 'POST',
      path: '/signup',
    },
    params: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        locale: { type: 'string' },
      },
      required: ['email', 'password', 'locale'],
      additionalProperties: false,
    },
    async handler(ctx) {
      try {
        await settingsService.registerAdmin({ ...ctx.params, ctx });
        const settings = await settingsService.findOne({ ctx });
        return { status: 200, settings };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
  setLanguagesRest: {
    rest: {
      method: 'POST',
      path: '/languages',
    },
    async handler(ctx) {
      const { langs, defaultLang } = ctx.params;
      await settingsService.setLanguages({ langs, defaultLang, ctx });
      const settings = await settingsService.findOne({ ctx });
      return { status: 200, settings };
    },
  },
  getLanguagesRest: {
    rest: {
      method: 'GET',
      path: '/languages',
    },
    async handler(ctx) {
      try {
        const langs = await settingsService.getLanguages({ ctx });
        return { status: 200, langs };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return { status: 400, error: e.message };
      }
    },
  },
};
