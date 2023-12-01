/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const {
  addKnowledge,
  updateKnowledge,
  listKnowledges,
} = require('../../core/knowledges');

const postKnowledgeRest = require('./openapi/knowledges/postKnowledgeRest');
const putKnowledgeRest = require('./openapi/knowledges/putKnowledgeRest');
const listKnowledgeRest = require('./openapi/knowledges/listKnowledgeRest');
/** @type {ServiceSchema} */
module.exports = {
  postKnowledgeRest: {
    openapi: postKnowledgeRest.openapi,
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const knowledge = await addKnowledge({ data: ctx.params, ctx });
      return { status: 200, knowledge };
    },
  },
  putKnowledgeRest: {
    openapi: putKnowledgeRest.openapi,
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const knowledge = await updateKnowledge({ data: ctx.params, ctx });
      return { status: 200, knowledge };
    },
  },
  listKnowledgeRest: {
    openapi: listKnowledgeRest.openapi,
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        page: { type: ['number', 'string'] },
        size: { type: ['number', 'string'] },
        program: { type: 'string' },
      },
      required: ['page', 'size', 'program'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const { page, size, program } = ctx.params;
      const data = await listKnowledges({
        page: parseInt(page, 10),
        size: parseInt(size, 10),
        program,
      });
      return { status: 200, data };
    },
  },
};
