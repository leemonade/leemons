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
const settingsService = require('../core/settings');

/** @type {ServiceSchema} */
module.exports = {
  actions: {
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
          'plugins.permissions.setup': {
            actions: ['admin'],
          },
        }),
      ],
      async handler(ctx) {
        const validator = new LeemonsValidator({
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
        });
        if (validator.validate(ctx.params)) {
          const settings = await settingsService.update({ ...ctx.params, ctx });
          return { status: 200, settings };
        }
        throw validator.error;
      },
    },
    signupRest: {
      rest: {
        method: 'POST',
        path: '/signup',
      },
      async handler(ctx) {
        const validator = new LeemonsValidator({
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            locale: { type: 'string' },
          },
          required: ['email', 'password', 'locale'],
          additionalProperties: false,
        });
        if (validator.validate(ctx.params)) {
          try {
            await settingsService.registerAdmin({ ...ctx.params, ctx });
            const settings = await settingsService.findOne({ ctx });
            return { status: 200, settings };
          } catch (e) {
            ctx.meta.$statusCode = 400;
            return { status: 400, error: e.message };
          }
        } else {
          throw validator.error;
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
  },
};
