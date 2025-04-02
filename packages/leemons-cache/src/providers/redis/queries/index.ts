import type { Redis } from 'ioredis';
import type { CacheContext } from '../../../types';
import { Queries } from './Queries';

interface QueriesConfig {
  client: Redis;
  isCluster: boolean;
}

type CacheQueries = CacheContext['cache'];

type QueryMethods = {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any, ttl?: number) => Promise<'OK'>;
  has: (key: string) => Promise<number>;
  delete: (key: string) => Promise<number>;
  getMany: (keys: string[]) => Promise<Record<string, any>>;
  setMany: (
    values: { key: string; val: any; ttl?: number }[]
  ) => Promise<Array<[Error | null, any]> | null>;
  hasMany: (keys: string[]) => Promise<Record<string, boolean>>;
  deleteMany: (keys: string[]) => Promise<number>;
  deleteByNamespace: (namespace: string, filter?: (key: string) => boolean) => Promise<number>;
  registerNamespace: (params: { namespace: string }) => Promise<void>;
};

export function createQueries(
  client: Redis,
  { isCluster }: QueriesConfig
): (pluginName: string) => CacheQueries {
  return (pluginName: string) => {
    const queriesInstance = new Queries({ client, isCluster, pluginName });

    // Pick only public methods keeping reference to class
    const methods = [
      'get',
      'set',
      'has',
      'delete',
      'getMany',
      'setMany',
      'hasMany',
      'deleteMany',
      'deleteByNamespace',
      'registerNamespace',
    ] as const;

    return methods.reduce<CacheQueries>((acc, key) => {
      const method = queriesInstance[key].bind(queriesInstance) as QueryMethods[typeof key];
      acc[key === 'delete' ? 'del' : key] = method as any;
      return acc;
    }, {} as CacheQueries);
  };
}
