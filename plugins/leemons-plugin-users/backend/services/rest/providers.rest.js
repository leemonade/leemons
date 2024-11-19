const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const { getProvider } = require('../../core/providers/getProvider');
const { listProviders } = require('../../core/providers/listProviders');
const { useProvider } = require('../../core/providers/useProvider');

module.exports = {
  useProviderRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    handler: async (ctx) => {
      const { provider } = ctx.params;

      const response = await useProvider({ provider, ctx });

      return { response };
    },
  },
  getProviderRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    handler: async (ctx) => {
      const provider = await getProvider({ ctx });

      return { provider };
    },
  },
  listProvidersRest: {
    rest: {
      method: 'GET',
      path: '/list',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    handler: async (ctx) => {
      const providers = await listProviders({ ctx });

      return { providers };
    },
  },
};
