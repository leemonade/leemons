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
  list,
  save,
  getOverlapsWithOtherConfigurations,
  getActive,
  addClick,
  addView,
} = require('../../core/messages');

/** @type {ServiceSchema} */
module.exports = {
  listRest: {
    rest: {
      method: 'POST',
      path: '/list',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'board-messages.board-messages': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
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
          filters: {
            type: 'object',
            additionalProperties: true,
          },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const data = await list({
          page: parseInt(ctx.params.page, 10),
          size: parseInt(ctx.params.size, 10),
          filters: ctx.params.filters,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  saveRest: {
    rest: {
      method: 'POST',
      path: '/save',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'board-messages.board-messages': {
            actions: ['update', 'create', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const message = await save({
        data: ctx.params,
        ctx,
      });
      return { status: 200, message };
    },
  },
  getOverlapsRest: {
    rest: {
      method: 'POST',
      path: '/overlaps',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'board-messages.board-messages': {
            actions: ['update', 'create', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const messages = await getOverlapsWithOtherConfigurations({
        item: ctx.params,
        ctx,
      });
      return { status: 200, messages };
    },
  },
  getActiveRest: {
    rest: {
      method: 'POST',
      path: '/active',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const message = await getActive({
        data: ctx.params,
        ctx,
      });
      return { status: 200, message };
    },
  },
  addClickRest: {
    rest: {
      method: 'POST',
      path: '/click',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const messages = await addClick({
        id: ctx.params.id,
        ctx,
      });
      return { status: 200, messages };
    },
  },
  addViewRest: {
    rest: {
      method: 'POST',
      path: '/view',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const messages = await addView({
        id: ctx.params.id,
        ctx,
      });
      return { status: 200, messages };
    },
  },
};
