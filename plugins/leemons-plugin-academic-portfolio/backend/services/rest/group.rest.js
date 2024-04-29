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

const postGroupRest = require('./openapi/groups/postGroupRest');
const deleteGroupFromClassesUnderNodeTreeRest = require('./openapi/groups/deleteGroupFromClassesUnderNodeTreeRest');
const putGroupRest = require('./openapi/groups/putGroupRest');
const listGroupRest = require('./openapi/groups/listGroupRest');
const duplicateGroupWithClassesUnderNodeTreeRest = require('./openapi/groups/duplicateGroupWithClassesUnderNodeTreeRest');
const duplicateGroupRest = require('./openapi/groups/duplicateGroupRest');
/** @type {ServiceSchema} */
module.exports = {
  postGroupRest: {
    openapi: postGroupRest.openapi,
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
    openapi: deleteGroupFromClassesUnderNodeTreeRest.openapi,
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
    openapi: putGroupRest.openapi,
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
    openapi: listGroupRest.openapi,
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
    openapi: duplicateGroupWithClassesUnderNodeTreeRest.openapi,
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
    openapi: duplicateGroupRest.openapi,
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
