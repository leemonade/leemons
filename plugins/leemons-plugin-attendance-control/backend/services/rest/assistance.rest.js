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

/** @type {ServiceSchema} */
module.exports = {
  rollCallRest: {
    rest: {
      path: '/roll-call',
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
    async handler() {
      return { status: 200 };
    },
  },
};
