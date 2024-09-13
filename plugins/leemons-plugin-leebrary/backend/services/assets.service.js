/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsError } = require('@leemons/error');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { pluginName } = require('../config/constants');
const { add } = require('../core/assets/add');
const { duplicate } = require('../core/assets/duplicate');
const { exists } = require('../core/assets/exists');
const { filterByVersionOfType } = require('../core/assets/filterByVersion');
const { getByIds } = require('../core/assets/getByIds');
const { prepareAsset } = require('../core/assets/prepareAsset');
const { remove } = require('../core/assets/remove');
const { update } = require('../core/assets/update');
const { list } = require('../core/search');
const { getServiceModels } = require('../models');

const restActions = require('./rest/assets.rest');

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
        const { shouldPrepareAssets, signedURLExpirationTime, ...params } = ctx.params;
        const assets = await getByIds({ ...params, ctx });

        if (shouldPrepareAssets) {
          // The option of setting a custom singURLExpirationTime is not available for rests requests
          const processSingnedUrlsPromises = assets.map((asset) =>
            prepareAsset({
              rawAsset: asset,
              isPublished: asset.isPublished,
              signedURLExpirationTime,
              ctx,
            })
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
    filterByVersionOfType: {
      handler(ctx) {
        const ALLOWED_PLUGINS = ['bulk-data'];
        if (!ALLOWED_PLUGINS.includes(ctx.callerPlugin)) {
          throw new LeemonsError(ctx, {
            message: `Not allowed to be called from ${ctx.callerPlugin}`,
          });
        }

        return filterByVersionOfType({ ...ctx.params, ctx });
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
    list: {
      async handler(ctx) {
        const assets = await list({
          ...ctx.params,

          ctx,
        });

        return {
          status: 200,
          assets,
        };
      },
    },
  },
};
