const _ = require('lodash');
const { getPluginNameFromCTX } = require('@leemons/service-name-parser');
const nodeCache = require('./types/node');
const { redisCache, getClientConfig } = require('./types/redis');

let nodeCacheInstance;
let redisCacheInstance;

async function modifyCTX(ctx, { redis }) {
  const pluginName = getPluginNameFromCTX(ctx);

  const redisConfig = getClientConfig(redis);

  if (redisConfig) {
    if (!redisCacheInstance) {
      redisCacheInstance = await redisCache(redisConfig);
    }
    ctx.cache = redisCacheInstance({ pluginName, ctx });
  } else {
    if (!nodeCacheInstance) {
      nodeCacheInstance = nodeCache();
    }
    ctx.cache = nodeCacheInstance(pluginName);
  }
}

module.exports = ({ redis, namespaces } = {}) => ({
  name: '',
  hooks: {
    before: {
      '*': [
        async function (ctx) {
          await modifyCTX(ctx, {
            redis,
          });
        },
      ],
    },
  },
  created() {
    _.forIn(this.events, (value, key) => {
      this.events[key] = async (params, opts, { afterModifyCTX } = {}) =>
        value(params, opts, {
          afterModifyCTX: async (ctx) => {
            await modifyCTX(ctx, {
              redis,
            });
            if (_.isFunction(afterModifyCTX)) {
              await afterModifyCTX(ctx);
            }
          },
        });
    });
  },

  async started() {
    if (namespaces?.length) {
      const ctx = { service: this };
      await modifyCTX(ctx, {
        redis,
      });

      await Promise.all(namespaces.map((namespace) => ctx.cache.registerNamespace({ namespace })));
    }
  },
});
