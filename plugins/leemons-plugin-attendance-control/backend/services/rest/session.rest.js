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
const { getTemporalSessions, byIds, save } = require('../../core/session');

const getTemporalSessionsRest = require('./openapi/session/getTemporalSessionsRest');
const getClassSessionsRest = require('./openapi/session/getClassSessionsRest');
const detailRest = require('./openapi/session/detailRest');
const saveRest = require('./openapi/session/saveRest');
/** @type {ServiceSchema} */
module.exports = {
  getTemporalSessionsRest: {
    openapi: getTemporalSessionsRest.openapi,
    rest: {
      path: '/temporal/:class',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'attendance-control.attendance': {
            actions: ['admin', 'view', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const sessions = await getTemporalSessions({
        classeId: ctx.params.class,
        ctx,
      });
      return { status: 200, sessions };
    },
  },
  getClassSessionsRest: {
    openapi: getClassSessionsRest.openapi,
    rest: {
      path: '/class/sessions',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'attendance-control.attendance': {
            actions: ['admin', 'view', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const sessions = await getTemporalSessions({
        classeId: ctx.params.class,
        ...ctx.params,
        withAssistances: true,
        ctx,
      });
      return { status: 200, sessions };
    },
  },
  detailRest: {
    openapi: detailRest.openapi,
    rest: {
      path: '/detail/:id',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'attendance-control.attendance': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const [session] = await byIds({
        ids: ctx.params.id,
        ctx,
      });
      return { status: 200, session };
    },
  },
  saveRest: {
    openapi: saveRest.openapi,
    rest: {
      path: '/save',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'attendance-control.attendance': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const session = await save({
        body: ctx.params,
        ctx,
      });
      return { status: 200, session };
    },
  },
};
