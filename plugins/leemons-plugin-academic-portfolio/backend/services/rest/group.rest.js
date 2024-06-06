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
  addGroup,
  updateGroup,
  listGroups,
  removeGroupFromClassesUnderNodeTree,
  duplicateGroupWithClassesUnderNodeTreeByIds,
  duplicateGroup,
  getGroupById,
} = require('../../core/groups');

/** @type {ServiceSchema} */
module.exports = {
  postGroupRest: {
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
      const group = await addGroup({ data: ctx.params, ctx });
      return { status: 200, group };
    },
  },
  deleteGroupFromClassesUnderNodeTreeRest: {
    rest: {
      path: '/group-from-classes-under-node-tree',
      method: 'DELETE',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      await removeGroupFromClassesUnderNodeTree(ctx.params.group);
      return { status: 200 };
    },
  },
  putGroupRest: {
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
      const group = await updateGroup({ data: ctx.params, ctx });
      return { status: 200, group };
    },
  },
  listGroupRest: {
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
  getGroupDetails: {
    rest: {
      path: '/:id',
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
    async handler(ctx) {
      const { id } = ctx.params;
      const data = await getGroupById({ id, ctx });
      return { status: 200, data };
    },
  },
  duplicateGroupWithClassesUnderNodeTreeRest: {
    rest: {
      path: '/:id/duplicate-with-classes-under-node-tree',
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
      const duplications = await duplicateGroupWithClassesUnderNodeTreeByIds({
        nodeTypes: ctx.params.nodeTypes,
        ids: ctx.params.id,
      });
      return { status: 200, duplications };
    },
  },
  duplicateGroupRest: {
    rest: {
      path: '/duplicate',
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
      const duplications = await duplicateGroup({ data: ctx.params, ctx });
      return { status: 200, duplications };
    },
  },
};
