/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');

const create = require('../../core/config/create');
const get = require('../../core/config/get');
const has = require('../../core/config/has');
const update = require('../../core/config/update');
const deleteOne = require('../../core/config/delete');

/** @type {ServiceSchema} */
module.exports = {
  createRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.config': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const config = await create({ ...ctx.params, ctx });
      return {
        status: 200,
        config,
      };
    },
  },
  getRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.config': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      let data = ctx.params.entities;
      // En lo viejo siempre se hacia el parse pero como no se si moleculer hace magia me aseguro de hacer el parse solo si es un string
      if (_.isString(data)) {
        data = JSON.parse(data);
      }
      const config = await get({ entitiesObj: data, ctx });
      return {
        status: 200,
        config,
      };
    },
  },
  hasRest: {
    rest: {
      method: 'GET',
      path: '/has',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.config': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      let data = ctx.params.entities;
      // En lo viejo siempre se hacia el parse pero como no se si moleculer hace magia me aseguro de hacer el parse solo si es un string
      if (_.isString(data)) {
        data = JSON.parse(data);
      }
      const exists = await has({ entitiesObj: data, ctx });
      return {
        status: 200,
        exists,
      };
    },
  },
  updateRest: {
    rest: {
      method: 'PUT',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.config': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const config = await update({ ...ctx.params, ctx });
      return {
        status: 200,
        config,
      };
    },
  },
  deleteRest: {
    rest: {
      method: 'DELETE',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.config': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      let data = ctx.params.entities;
      // En lo viejo siempre se hacia el parse pero como no se si moleculer hace magia me aseguro de hacer el parse solo si es un string
      if (_.isString(data)) {
        data = JSON.parse(data);
      }
      const deleted = await deleteOne({ entitiesObj: data, ctx });
      return {
        status: 200,
        deleted,
      };
    },
  },
};
