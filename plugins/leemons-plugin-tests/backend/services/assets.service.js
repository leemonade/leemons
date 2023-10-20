/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { findByAssetIds } = require('../core/questions-banks');

/** @type {ServiceSchema} */
module.exports = {
  name: `tests.assets`,
  version: 1,
  mixins: [LeemonsMiddlewaresMixin(), LeemonsCacheMixin(), LeemonsDeploymentManagerMixin()],
  actions: {
    getByIds: {
      handler(ctx) {
        return findByAssetIds({ ids: ctx.params.assetIds, ctx });
      },
    },
  },
};
