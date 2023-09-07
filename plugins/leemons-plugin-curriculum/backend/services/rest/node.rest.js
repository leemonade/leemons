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
const _ = require('lodash');

const { addNode, saveNode } = require('../../core/nodes');

// TODO [Importante]: Añadir autenticación y permisos
/** @type {ServiceSchema} */
module.exports = {
  postNodeRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const node = await addNode({ data: ctx.params, ctx });
      return { status: 200, node };
    },
  },
  saveNodeRest: {
    rest: {
      method: 'PUT',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const node = await saveNode({ nodeId: ctx.params.id, ...ctx.params, ctx });
      return { status: 200, node };
    },
  },
};
