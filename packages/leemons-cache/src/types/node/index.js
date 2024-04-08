const { isFunction } = require('lodash');
const NodeCache = require('node-cache');

const namespaces = new Map();

function generateKey(key, pluginName) {
  return `${pluginName}.${key}`;
}

function cleanKey(key, pluginName) {
  return key.replace(new RegExp(`^${pluginName}\\.`), '');
}

module.exports = function nodeCache() {
  const cache = new NodeCache();
  return (pluginName) => ({
    get: async (key) => cache.get(generateKey(key, pluginName)),
    has: async (key) => cache.has(generateKey(key, pluginName)),
    set: async (key, value, ttl) => cache.set(generateKey(key, pluginName), value, ttl),
    delete: async (key) => {
      if (Array.isArray(key)) {
        throw new Error('Delete only supports single key deletions');
      }
      return cache.del(generateKey(key, pluginName));
    },

    getMany: async (keys) =>
      Object.fromEntries(
        Object.entries(cache.mget(keys.map((key) => generateKey(key, pluginName)))).map(
          ([key, value]) => [cleanKey(key, pluginName), value]
        )
      ),
    hasMany: async (keys) => {
      const hasKeys = {};
      keys.forEach((key) => {
        hasKeys[key] = cache.has(generateKey(key, pluginName));
      });

      return hasKeys;
    },
    setMany: async (values) =>
      cache.mset(values.map((args) => ({ ...args, key: generateKey(args.key, pluginName) }))),
    deleteMany: async (keys) => cache.del(keys.map((key) => generateKey(key, pluginName))),
    registerNamespace: async ({ namespace: _namespace }) => {
      const namespace = generateKey(_namespace, pluginName);

      if (!namespaces.has(namespace)) {
        namespaces.set(namespace, true);
      }
    },
    deleteByNamespace: async (_namespace, filter) => {
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
};
