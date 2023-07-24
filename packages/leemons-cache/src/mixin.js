const _ = require('lodash');
const { getPluginNameFromCTX } = require('leemons-service-name-parser');
const nodeCache = require('./types/node');
const redisCache = require('./types/redis');

let nodeCacheInstance;
let redisCacheInstance;

async function modifyCTX(ctx, { redis }) {
  const pluginName = getPluginNameFromCTX(ctx);
  const redisConfig = redis || process.env.CACHE_REDIS_URI || null;
  if (redisConfig) {
    if (!redisCacheInstance) {
      redisCacheInstance = await redisCache(redisConfig);
    }
    ctx.cache = redisCacheInstance(pluginName);
  } else {
    if (!nodeCacheInstance) {
      nodeCacheInstance = nodeCache();
    }
    ctx.cache = nodeCacheInstance(pluginName);
  }
}

module.exports = ({ redis } = {}) => ({
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
});
