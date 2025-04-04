import { isFunction } from "lodash";
import NodeCache from "node-cache";
import type { NodeCacheInstance } from "../../types";

const namespaces = new Map<string, boolean>();

function generateKey(key: string, pluginName: string): string {
  return `${pluginName}.${key}`;
}

function cleanKey(key: string, pluginName: string): string {
  return key.replace(new RegExp(`^${pluginName}\\.`), "");
}

interface SetManyValue {
  key: string;
  val: any;
  ttl?: number;
}

export function nodeCache(): NodeCacheInstance {
  const cache = new NodeCache();
  return (pluginName: string) => ({
    get: async (key: string) => cache.get(generateKey(key, pluginName)),
    has: async (key: string) => Number(cache.has(generateKey(key, pluginName))),
    set: async (key: string, value: any, ttl?: number) => {
      cache.set(generateKey(key, pluginName), value, ttl ?? 0);
      return "OK";
    },
    del: async (key: string) => {
      if (Array.isArray(key)) {
        throw new Error("Delete only supports single key deletions");
      }
      return cache.del(generateKey(key, pluginName));
    },

    getMany: async (keys: string[]) =>
      Object.fromEntries(
        Object.entries(
          cache.mget(keys.map((key) => generateKey(key, pluginName)))
        ).map(([key, value]) => [cleanKey(key, pluginName), value])
      ),
    hasMany: async (keys: string[]) => {
      const hasKeys: Record<string, boolean> = {};
      keys.forEach((key) => {
        hasKeys[key] = cache.has(generateKey(key, pluginName));
      });

      return hasKeys;
    },
    setMany: async (values: SetManyValue[]) => {
      try {
        const results = values.map((args) => {
          const key = generateKey(args.key, pluginName);
          const success = cache.set(key, args.val, args.ttl ?? 0);
          return [null, success] as [Error | null, boolean];
        });
        return results;
      } catch (error) {
        return null;
      }
    },
    deleteMany: async (keys: string[]) =>
      cache.del(keys.map((key) => generateKey(key, pluginName))),
    registerNamespace: async ({
      namespace: _namespace,
    }: { namespace: string }) => {
      const namespace = generateKey(_namespace, pluginName);

      if (!namespaces.has(namespace)) {
        namespaces.set(namespace, true);
      }
    },
    deleteByNamespace: async (
      _namespace: string,
      filter?: (key: string) => boolean
    ) => {
      const namespace = generateKey(_namespace, pluginName);

      if (!namespaces.has(namespace)) {
        return 0;
      }

      let keys = cache.keys().filter((key) => key.startsWith(namespace));

      if (isFunction(filter)) {
        keys = keys.filter((key) => filter(cleanKey(key, pluginName)));
      }

      return cache.del(keys);
    },
  });
}
