const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { getRole, listRoles } = require('../../core/roles');

module.exports = {
  getRole: {
    rest: {
      path: '/:role',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    handler(ctx) {
      return getRole({ ...ctx.params, ctx });
    },
  },
  listRoles: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    handler(ctx) {
      const { details } = ctx.params;

      return listRoles({ ctx, details: details === 'true' });
    },
  },
};
