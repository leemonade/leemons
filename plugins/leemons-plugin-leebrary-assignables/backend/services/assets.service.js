/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { pluginName } = require('../config/constants');
const { getByAssetIds, search } = require('../core/provider');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.assets`,
  version: 1,
  mixins: [LeemonsMiddlewaresMixin(), LeemonsCacheMixin(), LeemonsDeploymentManagerMixin()],
  actions: {
    getByIds: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return getByAssetIds(payload);
      },
    },
    search: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return search(payload);
      },
    },
  },
};
