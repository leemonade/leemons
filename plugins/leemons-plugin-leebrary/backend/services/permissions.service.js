/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { pluginName } = require('../config/constants');
const {
  set: setCenterAssetItemPermission,
} = require('../core/permissions/centerAssetItemPermission');
const { getByAssets } = require('../core/permissions/getByAssets');
const { set } = require('../core/permissions/set');
const { getServiceModels } = require('../models');

const restActions = require('./rest/permissions.rest');
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
        return await getByAssets({
          assetIds: ctx.params.assets,
          onlyShared: ctx.params.onlyShared,
          showPublic: ctx.params.showPublic,
          ctx,
        });
      },
    },
    setCenterAssetItemPermission: {
      handler(ctx) {
        return setCenterAssetItemPermission({ ...ctx.params, ctx });
      },
    },
  },
};
