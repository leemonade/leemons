/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('@leemons/validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const {
  addKnowledgeArea,
  updateKnowledgeArea,
  listKnowledgeAreas,
} = require('../../core/knowledges');
const {
  removeKnowledgeArea,
} = require('../../core/knowledges/removeKnowledgeArea');
const {
  getKnowledgeAreaById,
} = require('../../core/knowledges/getKnowledgeAreaById');
const { permissions } = require('../../config/constants');

const postKnowledgeRest = require('./openapi/knowledges/postKnowledgeRest');
const putKnowledgeRest = require('./openapi/knowledges/putKnowledgeRest');
const listKnowledgeRest = require('./openapi/knowledges/listKnowledgeRest');
const deleteSubjectTypeRest = require('./openapi/knowledges/deleteSubjectTypeRest');
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
          [permissions.names.programs]: {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const knowledge = await addKnowledgeArea({ data: ctx.params, ctx });
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
          [permissions.names.programs]: {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const knowledge = await updateKnowledgeArea({ data: ctx.params, ctx });
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
          [permissions.names.programs]: {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          program: { type: 'string' },
          center: { type: 'string' },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, center } = ctx.params;
        const data = await listKnowledgeAreas({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          center,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  deleteSubjectTypeRest: {
    openapi: deleteSubjectTypeRest.openapi,
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          [permissions.names.programs]: {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { id, soft } = ctx.params;
      const data = await removeKnowledgeArea({ id, soft, ctx });
      return { status: 200, data };
    },
  },
  getKnowledgeAreaDetails: {
    rest: {
      path: '/:id',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          [permissions.names.programs]: {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { id } = ctx.params;
      const data = await getKnowledgeAreaById({ id, ctx });
      return { status: 200, data };
    },
  },
};
