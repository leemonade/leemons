const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const assignAsset = require('../../core/assignables/assignAsset');

module.exports = {
  assign: {
    rest: {
      path: '/assign',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    handler: async (ctx) => {
      const { assignable, instance } = ctx.params;

      return assignAsset({ assignable, instance, ctx });
    },
  },
};
