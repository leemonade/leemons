/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('@leemons/validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
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
const getGeneralConfigRest = require('./openapi/config/getGeneralConfigRest');
const getCenterConfigRest = require('./openapi/config/getCenterConfigRest');
const getProgramConfigRest = require('./openapi/config/getProgramConfigRest');
const getRest = require('./openapi/config/getRest');
const saveRest = require('./openapi/config/saveRest');
const getAdminConfigRest = require('./openapi/config/getAdminConfigRest');
const saveAdminConfigRest = require('./openapi/config/saveAdminConfigRest');
/** @type {ServiceSchema} */
module.exports = {
  getGeneralConfigRest: {
    openapi: getGeneralConfigRest.openapi,
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
    openapi: getCenterConfigRest.openapi,
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
    openapi: getProgramConfigRest.openapi,
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
    openapi: getRest.openapi,
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const config = await get({
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, config };
    },
  },
  saveRest: {
    openapi: saveRest.openapi,
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
    openapi: getAdminConfigRest.openapi,
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
    openapi: saveAdminConfigRest.openapi,
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
