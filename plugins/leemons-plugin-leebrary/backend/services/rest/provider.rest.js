/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const { list: listProviders } = require('../../core/providers/list');
const { setProviderConfig, setActiveProvider } = require('../../core/settings');
const { getByName: getProviderByName } = require('../../core/providers/getByName');

/** @type {ServiceSchema} */
module.exports = {
  listRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const providers = await listProviders({ ctx });
      return { status: 200, providers };
    },
  },
  setConfigRest: {
    rest: {
      method: 'POST',
      path: '/config',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const isSuperAdmin = await ctx.tx.call('users.users.isSuperAdmin', {
        userId: ctx.meta.userSession.id,
      });
      if (isSuperAdmin) {
        const providers = await setProviderConfig({
          providerName: ctx.params.provider,
          config: ctx.params.config,
          ctx: { ...ctx, callerPlugin: 'leebrary' },
        });
        return {
          status: 200,
          providers,
        };
      }
      return {
        status: 400,
        message: 'Only super admin allowed',
      };
    },
  },
  deleteConfigRest: {
    rest: {
      path: '/config/delete',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const isSuperAdmin = await ctx.tx.call('users.users.isSuperAdmin', {
        userId: ctx.meta.userSession.id,
      });

      if (isSuperAdmin) {
        const provider = getProviderByName({ name: ctx.params.provider, ctx });
        if (provider?.supportedMethods?.removeConfig) {
          await ctx.tx.call(`${ctx.params.provider}.provider.removeConfig`, {});
        }
        await setActiveProvider({ providerName: null, ctx });
        return {
          status: 200,
        };
      }
      return {
        status: 400,
        message: 'Only super admin allowed',
      };
    },
  },
};
