/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */
const { LeemonsValidator } = require('leemons-validator');
const { LeemonsMiddlewareAuthenticated } = require('leemons-middlewares');
const { list } = require('../../core/permissions/list');
const { getUserAgentPermissions } = require('../../core/permissions');

module.exports = {
  listRest: {
    rest: {
      path: '/list',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      console.log('wtf');
      const permissions = await list({ ctx });
      return { status: 200, permissions };
    },
  },
  getPermissionsWithActionsIfIHaveRest: {
    rest: {
      path: '/get-if-have', // rename to exist ?
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          permissionNames: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: ['permissionNames'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const permissions = await getUserAgentPermissions({
          userAgent: ctx.meta.userSession.userAgents,
          query: { permissionName: ctx.params.permissionNames },
          ctx,
        });
        return { status: 200, permissions };
      }
      throw validator.error;
    },
  },
};
