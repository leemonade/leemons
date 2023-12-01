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
  updateSubjectType,
  addSubjectType,
  listSubjectType,
} = require('../../core/subject-type');

const postSubjectTypeRest = require('./openapi/subjectType/postSubjectTypeRest');
const putSubjectTypeRest = require('./openapi/subjectType/putSubjectTypeRest');
const listSubjectTypeRest = require('./openapi/subjectType/listSubjectTypeRest');
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
          'academic-portfolio.programs': {
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
          'academic-portfolio.programs': {
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
          allowedPermissions: {
            'academic-portfolio.programs': {
              actions: ['admin', 'view'],
            },
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
      const data = await listSubjectType({
        page: parseInt(page, 10),
        size: parseInt(size, 10),
        program,
        ctx,
      });
      return { status: 200, data };
    },
  },
};
