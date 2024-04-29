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
const _ = require('lodash');

const { addNodeLevels, updateNodeLevel } = require('../../core/nodeLevels');

// TODO [Importante]: Añadir autenticación y permisos
const postNodeLevelsRest = require('./openapi/node-levels/postNodeLevelsRest');
const putNodeLevelRest = require('./openapi/node-levels/putNodeLevelRest');
/** @type {ServiceSchema} */
module.exports = {
  postNodeLevelsRest: {
    openapi: postNodeLevelsRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const nodeLevels = await addNodeLevels({ data: ctx.params, ctx });
      return { status: 200, nodeLevels };
    },
  },
  putNodeLevelRest: {
    openapi: putNodeLevelRest.openapi,
    rest: {
      method: 'PUT',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const nodeLevel = await updateNodeLevel({ data: ctx.params, ctx });
      return { status: 200, nodeLevel };
    },
  },
};
