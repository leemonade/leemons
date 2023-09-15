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

/** @type {ServiceSchema} */
module.exports = {
  getTemporalSessionsRest: {
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
