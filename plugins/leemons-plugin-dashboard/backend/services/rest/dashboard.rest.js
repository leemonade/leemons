const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const register = require('../../core/welcomeCompleted/register');
const unregister = require('../../core/welcomeCompleted/unregister');
const hasCompleted = require('../../core/welcomeCompleted/hasCompleted');

module.exports = {
  registerWelcomeCompleted: {
    rest: {
      method: 'POST',
      path: '/welcome',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await register({ ctx });

      return { status: 201 };
    },
  },
  unregisterWelcomeCompleted: {
    rest: {
      method: 'DELETE',
      path: '/welcome',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await unregister({ ctx });

      return { status: 204 };
    },
  },
  getWelcomeCompleted: {
    rest: {
      method: 'GET',
      path: '/welcome',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const result = await hasCompleted({ ctx });

      return { status: 200, completed: !!result };
    },
  },
};
