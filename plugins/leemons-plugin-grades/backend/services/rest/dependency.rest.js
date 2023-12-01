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
const { listGrades } = require('../../core/grades');
const {
  listRules,
  addRule,
  updateRule,
  removeRule,
} = require('../../core/rules');

const listDependenciesRest = require('./openapi/dependency/listDependenciesRest');
const deleteDependencyRest = require('./openapi/dependency/deleteDependencyRest');

const postDependencyRest = require('./openapi/dependency/postDependencyRest');
const putDependencyRest = require('./openapi/dependency/putDependencyRest');
/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  listDependenciesRest: {
    openapi: listDependenciesRest.openapi,
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    params: {
      type: 'object',
      properties: {
        page: { type: ['number', 'string'] },
        size: { type: ['number', 'string'] },
        center: { type: ['string'] },
      },
      required: ['page', 'size'],
      additionalProperties: false,
    },
    async handler(ctx) {
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
    },
  },
  postDependencyRest: {
    openapi: postDependencyRest.openapi,
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
    openapi: putDependencyRest.openapi,
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
    openapi: deleteDependencyRest.openapi,
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
