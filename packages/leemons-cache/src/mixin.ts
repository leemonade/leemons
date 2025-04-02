import type { AnyContext, ServiceSchema } from '@leemons/moleculer';
import { getPluginNameFromCTX } from '@leemons/service-name-parser';
import _ from 'lodash';
import { nodeCache } from './providers/node';
import { getClientConfig, redisCache } from './providers/redis';
import type { CacheContext, CacheOptions } from './types';

let nodeCacheInstance: ReturnType<typeof nodeCache>;
let redisCacheInstance: Awaited<ReturnType<typeof redisCache>>;

async function modifyCTX(ctx: AnyContext, { redis }: Pick<CacheOptions, 'redis'>) {
  const pluginName = getPluginNameFromCTX(ctx as any);
  const redisConfig = getClientConfig(redis);

  if (redisConfig) {
    if (!redisCacheInstance) {
      redisCacheInstance = await redisCache(redisConfig);
    }
    (ctx as CacheContext).cache = redisCacheInstance({ pluginName, ctx });
  } else {
    if (!nodeCacheInstance) {
      nodeCacheInstance = nodeCache();
    }
    (ctx as CacheContext).cache = nodeCacheInstance(pluginName);
  }
}

interface ServiceWithEvents {
  events?: Record<string, (params: any, opts: any, meta?: any) => Promise<any>>;
}

export function LeemonsCacheMixin({
  redis,
  namespaces,
}: CacheOptions = {}): Partial<ServiceSchema> {
  return {
    name: '',
    hooks: {
      before: {
        '*': [
          async function (ctx: AnyContext) {
            await modifyCTX(ctx, {
              redis,
            });
          },
        ],
      },
    },
    created(this: ServiceWithEvents) {
      if (this.events) {
        _.forIn(this.events, (value, key) => {
          if (value) {
            this.events![key] = async (
              params: any,
              opts: any,
              { afterModifyCTX }: { afterModifyCTX?: (ctx: AnyContext) => Promise<void> } = {}
            ) =>
              value(params, opts, {
                afterModifyCTX: async (ctx: AnyContext) => {
                  await modifyCTX(ctx, {
                    redis,
                  });
                  if (_.isFunction(afterModifyCTX)) {
                    await afterModifyCTX(ctx);
                  }
                },
              });
          }
        });
      }
    },

    async started() {
      if (namespaces?.length) {
        const ctx = { service: this } as AnyContext;
        await modifyCTX(ctx, {
          redis,
        });

        await Promise.all(
          namespaces.map((namespace) =>
            (ctx as CacheContext).cache.registerNamespace({ namespace })
          )
        );
      }
    },
  };
}
