/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('leemons-validator');
const { addKnowledge, updateKnowledge, listKnowledges } = require('../../core/knowledges');

/** @type {ServiceSchema} */
module.exports = {
  postKnowledgeRest: {
    rest: {
      path: '/knowledge',
      method: 'POST',
    },
    async handler(ctx) {
      const knowledge = await addKnowledge({ data: ctx.params, ctx });
      return { status: 200, knowledge };
    },
  },
  putKnowledgeRest: {
    rest: {
      path: '/knowledge',
      method: 'PUT',
    },
    async handler(ctx) {
      const knowledge = await updateKnowledge({ data: ctx.params, ctx });
      return { status: 200, knowledge };
    },
  },
  listKnowledgeRest: {
    rest: {
      path: '/knowledge',
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
        const data = await listKnowledges({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          program,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
};
