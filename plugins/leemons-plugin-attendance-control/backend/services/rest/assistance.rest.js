/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const rollCallRest = require('./openapi/assistance/rollCallRest');
/** @type {ServiceSchema} */
module.exports = {
  rollCallRest: {
    openapi: rollCallRest.openapi,
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
