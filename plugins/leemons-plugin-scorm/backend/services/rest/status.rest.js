/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const {
  savePackage,
  duplicatePackage,
  assignPackage,
  sharePackage,
  getPackage,
  deletePackage,
} = require('../../core/package');
const updateStatus = require('../../core/status/updateStatus');
const getScormAssignation = require('../../core/status/getScormAssignation');

/** @type {ServiceSchema} */
module.exports = {
  updateStatusRest: {
    rest: {
      method: 'PUT',
      path: '/:instance/:user',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const scormStatus = await updateStatus({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        scormStatus,
      };
    },
  },
  getScormAssignationRest: {
    rest: {
      method: 'GET',
      path: '/assignation/:instance/:user',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const assignation = await getScormAssignation({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        assignation,
      };
    },
  },
};
