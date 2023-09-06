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
const { createCredentialsForUserSession, setConfig, getConfig } = require('../../core/socket');
const { LeemonsError } = require('leemons-error');

/** @type {ServiceSchema} */
module.exports = {
  getCredentialsRest: {
    rest: {
      method: 'GET',
      path: '/credentials',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const credentials = await createCredentialsForUserSession({ ctx });
      return { status: 200, credentials };
    },
  },
  setConfigRest: {
    rest: {
      method: 'POST',
      path: '/config',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      if (process.env.DISABLE_AUTO_INIT === 'true')
        throw new LeemonsError(ctx, {
          message: 'We are in leemons sass mode, this endpoint is disabled for protection',
        });
      const isSuperAdmin = await ctx.tx.call('users.users.isSuperAdmin', {
        userId: ctx.meta.userSession.id,
      });
      if (isSuperAdmin) {
        const config = await setConfig({ data: ctx.params, ctx });
        return { status: 200, config };
      } else {
        return {
          status: 400,
          message: 'Only can super admin',
        };
      }
    },
  },
  getConfigRest: {
    rest: {
      method: 'GET',
      path: '/config',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      if (process.env.DISABLE_AUTO_INIT === 'true')
        throw new LeemonsError(ctx, {
          message: 'We are in leemons sass mode, this endpoint is disabled for protection',
        });
      const isSuperAdmin = await ctx.tx.call('users.users.isSuperAdmin', {
        userId: ctx.meta.userSession.id,
      });
      if (isSuperAdmin) {
        const config = await getConfig({ ctx });
        return { status: 200, config };
      } else {
        return {
          status: 400,
          message: 'Only can super admin',
        };
      }
    },
  },
};
