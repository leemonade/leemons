/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('leemons-validator');
const { updateSubjectType, addSubjectType, listSubjectType } = require('../../core/subject-type');

/** @type {ServiceSchema} */
module.exports = {
  postSubjectTypeRest: {
    rest: {
      path: '/subject-type',
      method: 'POST',
    },
    async handler(ctx) {
      const subjectType = await addSubjectType({ data: ctx.params, ctx });
      return { status: 200, subjectType };
    },
  },
  putSubjectTypeRest: {
    rest: {
      path: '/subject-type',
      method: 'PUT',
    },
    async handler(ctx) {
      const subjectType = await updateSubjectType({ data: ctx.params, ctx });
      return { status: 200, subjectType };
    },
  },
  listSubjectTypeRest: {
    rest: {
      path: '/subject-type',
      method: 'GET',
    },
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
