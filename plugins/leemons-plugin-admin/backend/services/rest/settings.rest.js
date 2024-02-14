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
const { LeemonsError } = require('@leemons/error');
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
          name: { type: 'string' },
          surnames: { type: 'string' },
          birthdate: { type: 'string' },
          gender: { type: 'string' },
        },
        required: ['email', 'locale'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        try {
          ctx.logger.debug('- Vamos a registrar al super admin', ctx.params.email);
          await settingsService.registerAdmin({ ...ctx.params, ctx });
          const settings = await settingsService.findOne({ ctx });
          return { status: 200, settings };
        } catch (e) {
          throw new LeemonsError(ctx, { message: e.message, httpStatusCode: 400 });
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
      const { langs, defaultLang, removeOthers } = ctx.params;
      await settingsService.setLanguages({ langs, defaultLang, removeOthers, ctx });
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
        throw new LeemonsError(ctx, { message: e.message, httpStatusCode: 400 });
      }
    },
  },
};
