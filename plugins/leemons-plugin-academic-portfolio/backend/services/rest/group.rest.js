/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsValidator } = require('leemons-validator');
const {
  addGroup,
  updateGroup,
  listGroups,
  removeGroupFromClassesUnderNodeTree,
  duplicateGroupWithClassesUnderNodeTreeByIds,
  duplicateGroup,
} = require('../../core/groups');

/** @type {ServiceSchema} */
module.exports = {
  postGroupRest: {
    rest: {
      path: '/group',
      method: 'POST',
    },
    async handler(ctx) {
      const group = await addGroup({ data: ctx.params, ctx });
      return { status: 200, group };
    },
  },
  deleteGroupFromClassesUnderNodeTreeRest: {
    rest: {
      path: '/group-from-classes-under-node-tree',
      method: 'DELETE',
    },
    async handler(ctx) {
      await removeGroupFromClassesUnderNodeTree(ctx.params.group);
      return { status: 200 };
    },
  },
  putGroupRest: {
    rest: {
      path: '/group',
      method: 'PUT',
    },
    async handler(ctx) {
      const group = await updateGroup({ data: ctx.params, ctx });
      return { status: 200, group };
    },
  },
  listGroupRest: {
    rest: {
      path: '/group',
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
        const { page, size, program, ...options } = ctx.params;
        const data = await listGroups({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          program,
          query: options,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  duplicateGroupWithClassesUnderNodeTreeRest: {
    rest: {
      path: '/group/:id/duplicate-with-classes-under-node-tree',
      method: 'POST',
    },
    async handler(ctx) {
      const duplications = await duplicateGroupWithClassesUnderNodeTreeByIds({
        nodeTypes: ctx.params.nodeTypes,
        ids: ctx.params.id,
      });
      return { status: 200, duplications };
    },
  },
  duplicateGroupRest: {
    rest: {
      path: '/group/duplicate',
      method: 'POST',
    },
    async handler(ctx) {
      const duplications = await duplicateGroup({ data: ctx.params, ctx });
      return { status: 200, duplications };
    },
  },
};
