/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');

const { LeemonsValidator } = require('leemons-validator');
const emailService = require('../../core/email');

const validateProviderConfigObj = {
  type: 'object',
  properties: {
    providerName: { type: 'string' },
    config: {
      type: 'object',
    },
  },
  required: ['providerName', 'config'],
  additionalProperties: false,
};

const validateRemoveProviderConfigObj = {
  type: 'object',
  properties: {
    providerName: { type: 'string' },
    id: { type: 'string' },
  },
  required: ['providerName', 'id'],
  additionalProperties: false,
};

module.exports = {
  providersRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'admin.setup': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const _providers = await emailService.providers({ ctx });
      return { providers: _providers };
    },
  },
  sendTestRest: {
    rest: {
      method: 'POST',
      path: '/send-test',
    },
    async handler() {
      //* Código sin portar a leemons Saas (estaba comentado en lo antiguo)
      /*
        const validator = new global.utils.LeemonsValidator(validateProviderConfigObj);
        if (validator.validate(ctx.request.body)) {
          const data = await emailService.sendTest(ctx.request.body);
          ctx.status = 200;
          ctx.body = { status: 200, data };
        } else {
          throw validator.error;
        }
        */
    },
  },
  sendCustomTestRest: {
    rest: {
      method: 'POST',
      path: '/send-custom-test',
    },
    async handler() {
      //* Código sin portar a leemons Saas (estaba comentado en lo antiguo)
      /*
        const validator = new global.utils.LeemonsValidator({
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' },
            body: { type: 'string' },
            subject: { type: 'string' },
          },
          required: ['from', 'to', 'body', 'subject'],
          additionalProperties: false,
        });
        if (validator.validate(ctx.request.body)) {
          const data = await emailService.sendCustomTest(ctx.request.body);
          ctx.status = 200;
          ctx.body = { status: 200, data };
        } else {
          throw validator.error;
        }
        */
    },
  },
  saveProviderRest: {
    rest: {
      method: 'POST',
      path: '/save-provider',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'admin.setup': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator(validateProviderConfigObj);
      if (validator.validate(ctx.params)) {
        const provider = await emailService.saveProvider({ ...ctx.params, ctx });
        return { status: 200, provider };
      }
      throw validator.error;
    },
  },
  removeProviderRest: {
    rest: {
      method: 'POST',
      path: '/remove-provider',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'admin.setup': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator(validateRemoveProviderConfigObj);
      if (validator.validate(ctx.params)) {
        await emailService.removeProvider({ ...ctx.params, ctx });

        return { status: 200 };
      }
      throw validator.error;
    },
  },
};
