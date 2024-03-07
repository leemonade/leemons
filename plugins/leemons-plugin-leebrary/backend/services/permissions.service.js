/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { getServiceModels } = require('../models');
const { pluginName } = require('../config/constants');
const restActions = require('./rest/permissions.rest');
const { set } = require('../core/permissions/set');
const { getByAssets } = require('../core/permissions/getByAssets');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.permissions`,
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    set: {
      handler(ctx) {
        return set({ ...ctx.params, ctx });
      },
    },
    getByAssets: {
      async handler(ctx) {
        const permissions = await getByAssets({
          assetIds: ctx.params.assets,
          onlyShared: ctx.params.onlyShared,
          showPublic: ctx.params.showPublic,
          ctx,
        });

        return permissions;
      },
    },
  },
};
