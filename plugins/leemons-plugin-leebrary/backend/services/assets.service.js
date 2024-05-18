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
const restActions = require('./rest/assets.rest');

const { getByIds } = require('../core/assets/getByIds');
const { add } = require('../core/assets/add');
const { update } = require('../core/assets/update');
const { exists } = require('../core/assets/exists');
const { remove } = require('../core/assets/files/remove');
const { duplicate } = require('../core/assets/duplicate');
const { prepareAsset } = require('../core/assets/prepareAsset');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.assets`,
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
    add: {
      handler(ctx) {
        return add({ ...ctx.params, ...(ctx.params?.options || {}), ctx });
      },
    },
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
    getByIds: {
      async handler(ctx) {
        const { shouldPrepareAssets, ...params } = ctx.params;
        const assets = await getByIds({ ...params, ctx });

        if (shouldPrepareAssets) {
          const processSingnedUrlsPromises = assets.map((asset) =>
            prepareAsset({ rawAsset: asset, isPublished: asset.isPublished, ctx })
          );

          const results = await Promise.allSettled(processSingnedUrlsPromises);
          return results
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value);
        }

        return assets;
      },
    },
    getCoverUrl: {
      handler(ctx) {
        // TODO: Esto deberia de hacerse en un paquete de leebrary para gastar menos recursos
        const hostname = process.env.API_URL?.startsWith('http') ? process.env.API_URL : '';
        return `${hostname}/api/v1/leebrary/file/img/${ctx.params.assetId}`;
      },
    },
    exists: {
      handler(ctx) {
        return exists({ ...ctx.params, ctx });
      },
    },
    remove: {
      handler(ctx) {
        return remove({ ...ctx.params, ctx });
      },
    },
    duplicate: {
      handler(ctx) {
        return duplicate({ ...ctx.params, ctx });
      },
    },
    getAllAssets: {
      async handler(ctx) {
        const filters = ctx.params ?? {};
        return ctx.tx.db.Assets.find({ ...filters }).lean();
      },
    },
  },
};
