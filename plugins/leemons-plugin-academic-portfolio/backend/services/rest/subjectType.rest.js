/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('leemons-validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');

const { updateSubjectType, addSubjectType, listSubjectType } = require('../../core/subject-type');

/** @type {ServiceSchema} */
module.exports = {
  postSubjectTypeRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.programs': {
          actions: ['create'],
        },
      }),
    ],
    async handler(ctx) {
      const subjectType = await addSubjectType({ data: ctx.params, ctx });
      return { status: 200, subjectType };
    },
  },
  putSubjectTypeRest: {
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.programs': {
          actions: ['update'],
        },
      }),
    ],
    async handler(ctx) {
      const subjectType = await updateSubjectType({ data: ctx.params, ctx });
      return { status: 200, subjectType };
    },
  },
  listSubjectTypeRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.programs': {
          actions: ['view'],
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
        },
        required: ['page', 'size', 'program'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, program } = ctx.params;
        const data = await listSubjectType({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          program,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
};
