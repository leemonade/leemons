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
const {
  createCredentialsForUserSession,
  setConfig,
  getConfig,
} = require('../../core/socket');

const getCredentialsRest = require('./openapi/socket/getCredentialsRest');
const setConfigRest = require('./openapi/socket/setConfigRest');
const getConfigRest = require('./openapi/socket/getConfigRest');
/** @type {ServiceSchema} */
module.exports = {
  getCredentialsRest: {
    openapi: getCredentialsRest.openapi,
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
    openapi: setConfigRest.openapi,
    rest: {
      method: 'POST',
      path: '/config',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      if (
        process.env.DISABLE_AUTO_INIT === 'true' &&
        process.env.ENVIRONMENT !== 'local'
      )
        throw new LeemonsError(ctx, {
          message:
            'We are in leemons sass mode, this endpoint is disabled for protection',
        });
      const isSuperAdmin = await ctx.tx.call('users.users.isSuperAdmin', {
        userId: ctx.meta.userSession.id,
      });
      if (isSuperAdmin) {
        const config = await setConfig({ data: ctx.params, ctx });
        return { status: 200, config };
      }
      return {
        status: 400,
        message: 'Only can super admin',
      };
    },
  },
  getConfigRest: {
    openapi: getConfigRest.openapi,
    rest: {
      method: 'GET',
      path: '/config',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      if (
        process.env.DISABLE_AUTO_INIT === 'true' &&
        process.env.ENVIRONMENT !== 'local'
      )
        throw new LeemonsError(ctx, {
          message:
            'We are in leemons sass mode, this endpoint is disabled for protection',
        });
      const isSuperAdmin = await ctx.tx.call('users.users.isSuperAdmin', {
        userId: ctx.meta.userSession.id,
      });
      if (isSuperAdmin) {
        const config = await getConfig({ ctx });
        return { status: 200, config };
      }
      return {
        status: 400,
        message: 'Only can super admin',
      };
    },
  },
};
