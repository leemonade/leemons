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
const { listGrades } = require('../../core/grades');
const { listRules, addRule, updateRule, removeRule } = require('../../core/rules');

/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  listDependenciesRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          center: { type: ['string'] },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, center, ...options } = ctx.params;
        const data = await listRules({
          ...options,
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          center,
          isDependency: true,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  postDependencyRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const rule = await addRule({
        data: ctx.params,
        isDependency: true,
        ctx,
      });
      return { status: 200, rule };
    },
  },
  putDependencyRest: {
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const rule = await updateRule({
        data: ctx.params,
        isDependency: true,
        ctx,
      });
      return { status: 200, rule };
    },
  },
  deleteDependencyRest: {
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const rule = await removeRule({
        id: ctx.params.id,
        isDependency: true,
        ctx,
      });
      return { status: 200, rule };
    },
  },
};
