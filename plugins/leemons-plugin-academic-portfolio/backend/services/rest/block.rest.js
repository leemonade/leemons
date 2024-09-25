/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');

const { permissions } = require('../../config/constants');
const { addBlock, updateBlock, listSubjectBlocks, removeBlock } = require('../../core/blocks');
const { getProgramCustomNomenclature } = require('../../core/programs');

/** @type {ServiceSchema} */
module.exports = {
  postBlockRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          [permissions.names.subjects]: {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const block = await addBlock({ data: ctx.params, ctx });
      return { status: 200, block };
    },
  },
  putBlockRest: {
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          [permissions.names.subjects]: {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const data = await updateBlock({ data: ctx.params, ctx });
      return { status: 200, data };
    },
  },
  listSubjectBlocksRest: {
    rest: {
      path: '/by-subject/:subjectId',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          [permissions.names.subjects]: {
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
          subjectId: { type: 'string' },
        },
        required: ['page', 'size', 'subjectId'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, subjectId } = ctx.params;

        const data = await listSubjectBlocks({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          subjectId,
          ctx,
        });

        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  removeBlockRest: {
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          [permissions.names.subjects]: {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { id, soft } = ctx.params;
      const data = await removeBlock({ id, soft, ctx });
      return { status: 200, data };
    },
  },
};
