import type { Context } from "@leemons/moleculer";
import type { Redis } from "ioredis";

export interface CacheOptions {
  redis?: string | Redis;
  namespaces?: string[];
}

export interface CacheContext extends Context {
  cache: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any, ttl?: number) => Promise<"OK">;
    del: (key: string) => Promise<number>;
    registerNamespace: (params: { namespace: string }) => Promise<void>;
    has: (key: string) => Promise<number>;
    getMany: (keys: string[]) => Promise<Record<string, any>>;
    setMany: (
      values: { key: string; val: any; ttl?: number }[]
    ) => Promise<Array<[Error | null, any]> | null>;
    hasMany: (keys: string[]) => Promise<Record<string, boolean>>;
    deleteMany: (keys: string[]) => Promise<number>;
    deleteByNamespace: (
      namespace: string,
      filter?: (key: string) => boolean
    ) => Promise<number>;
  };
}

export interface CachePluginOptions {
  pluginName: string;
  ctx: Context;
}

export interface NodeCacheInstance {
  (pluginName: string): CacheContext["cache"];
}

export interface RedisCacheInstance {
  (options: CachePluginOptions): CacheContext["cache"];
}

export interface RedisConfig {
  url?: string;
  cluster: boolean;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  client?: Redis;
}
