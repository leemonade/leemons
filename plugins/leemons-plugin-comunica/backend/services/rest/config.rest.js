/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('leemons-validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');
const {
  getGeneral,
  getCenter,
  getProgram,
  get,
  save,
  getFullByCenter,
  saveFullByCenter,
} = require('../../core/config');

// TODO AÑADIR PERMISOS
/** @type {ServiceSchema} */
module.exports = {
  getGeneralConfigRest: {
    rest: {
      path: '/general',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const config = await getGeneral({ ctx });
      return { status: 200, config };
    },
  },
  getCenterConfigRest: {
    rest: {
      path: '/center/:center',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const config = await getCenter({ ...ctx.params, ctx });
      return { status: 200, config };
    },
  },
  getProgramConfigRest: {
    rest: {
      path: '/program/:program',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const config = await getProgram({ ...ctx.params, ctx });
      return { status: 200, config };
    },
  },
  getRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const config = await get({ userAgent: ctx.meta.userSession.userAgents[0].id, ctx });
      return { status: 200, config };
    },
  },
  saveRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const config = await save({
        userAgent: ctx.meta.userSession.userAgents[0].id,
        config: ctx.params,
        ctx,
      });
      return { status: 200, config };
    },
  },
  getAdminConfigRest: {
    rest: {
      path: '/admin/config/:center',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'comunica.config': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const config = await getFullByCenter({
        ...ctx.params,
        ctx,
      });
      return { status: 200, config };
    },
  },
  saveAdminConfigRest: {
    rest: {
      path: '/admin/config/:center',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'comunica.config': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { center, ...data } = ctx.params;
      const config = await saveFullByCenter({
        center,
        data,
        ctx,
      });
      return { status: 200, config };
    },
  },
};
