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
  updateSubjectType,
  addSubjectType,
  listSubjectType,
  removeSubjectType,
} = require('../../core/subject-type');
const { permissions } = require('../../config/constants');

const postSubjectTypeRest = require('./openapi/subjectType/postSubjectTypeRest');
const putSubjectTypeRest = require('./openapi/subjectType/putSubjectTypeRest');
const listSubjectTypeRest = require('./openapi/subjectType/listSubjectTypeRest');
const deleteSubjectTypeRest = require('./openapi/subjectType/deleteSubjectTypeRest');
/** @type {ServiceSchema} */
module.exports = {
  postSubjectTypeRest: {
    openapi: postSubjectTypeRest.openapi,
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
      const subjectType = await addSubjectType({ data: ctx.params, ctx });
      return { status: 200, subjectType };
    },
  },
  putSubjectTypeRest: {
    openapi: putSubjectTypeRest.openapi,
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
      const subjectType = await updateSubjectType({ data: ctx.params, ctx });
      return { status: 200, subjectType };
    },
  },
  listSubjectTypeRest: {
    openapi: listSubjectTypeRest.openapi,
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
          center: { type: 'string' },
        },
        required: ['page', 'size', 'center'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, center } = ctx.params;
        const data = await listSubjectType({
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
      const data = await removeSubjectType({ id, soft, ctx });
      return { status: 200, data };
    },
  },
};
