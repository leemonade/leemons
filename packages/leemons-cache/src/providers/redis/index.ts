import type { Context } from '@leemons/moleculer';
import { getActionNameFromCTX } from '@leemons/service-name-parser';
import Redis from 'ioredis';
import _ from 'lodash';
import type {
  CacheContext,
  CachePluginOptions,
  RedisCacheInstance,
  RedisConfig,
} from '../../types';
import { createQueries } from './queries';

interface DefaultClientConfig {
  url?: string;
  cluster?: boolean;
  username?: string;
  password?: string;
  name?: string;
  database?: string;
}

function getDefaultClientConfig(): RedisConfig | null {
  const config: DefaultClientConfig = {
    url: process.env.CACHE_REDIS_URI,
    cluster: process.env.CACHE_REDIS_CLUSTER?.toLowerCase() === 'true',
    username: process.env.CACHE_REDIS_USERNAME,
    password: process.env.CACHE_REDIS_PASSWORD,
    name: process.env.CACHE_REDIS_NAME,
    database: process.env.CACHE_REDIS_DATABASE,
  };

  if (!config.url) {
    return null;
  }

  return {
    url: config.url,
    cluster: !!config.cluster,
  };
}

export function getClientConfig(_config?: string | Redis | RedisConfig): RedisConfig | null {
  if (!_config) {
    return getDefaultClientConfig();
  }

  if (_config instanceof Redis) {
    return {
      cluster: false,
      client: _config,
    };
  }

  if (_.isString(_config)) {
    return { url: _config, cluster: false };
  }

  return {
    ..._config,
    cluster: !!_config.cluster,
  };
}

function tracingWrapper<T extends (...args: any[]) => Promise<any>>(f: T, ctx?: Context): T {
  return ((...params: Parameters<T>) => {
    if (!ctx?.span) {
      return f(...params);
    }

    const span = ctx.broker.tracer.startSpan(`redis ${f.name}`, {
      parentSpan: ctx.span,
      type: 'cache',
      service: 'redis',
      tags: {
        params,
        action: getActionNameFromCTX(ctx as any),
        method: f.name,
      },
    });

    return f(...params)
      .then((res) => {
        span.finish();
        return res;
      })
      .catch((error) => {
        span.setError(error);
        span.finish();
        throw error;
      });
  }) as T;
}

export async function redisCache(config: RedisConfig): Promise<RedisCacheInstance> {
  let client: Redis;

  if (config.client) {
    client = config.client;
  } else if (!config.cluster && config.url) {
    client = new Redis(config.url);
  } else {
    throw new Error('redis cluster not supported');
  }

  client.on('error', (error: Error) => console.error(`Redis Error: ${error.message}`));

  const queries = createQueries(client, { isCluster: config.cluster, client });

  return ({ pluginName, ctx }: CachePluginOptions) => {
    const queriesObject = queries(pluginName);
    const wrappedQueries = Object.fromEntries(
      Object.entries(queriesObject).map(([key, f]) => [
        key,
        typeof f === 'function' ? tracingWrapper(f as (...args: any[]) => Promise<any>, ctx) : f,
      ])
    );

    return wrappedQueries as CacheContext['cache'];
  };
}
