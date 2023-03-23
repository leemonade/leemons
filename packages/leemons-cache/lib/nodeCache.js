const NodeCache = require('node-cache');

module.exports = function nodeCache() {
  const cache = new NodeCache();

  const leemonsCache = {
    get: async (key) => cache.get(key),
    has: async (key) => cache.has(key),
    set: async (key, value, ttl) => cache.set(key, value, ttl),
    delete: async (value) => {
      if (Array.isArray(value)) {
        throw new Error('Delete only supports single key deletions');
      }
      return cache.del(value);
    },

    getMany: async (keys) => cache.mget(keys),
    hasMany: async (keys) => {
      const hasKeys = {};
      keys.forEach((key) => {
        hasKeys[key] = cache.has(key);
      });

      return hasKeys;
    },
    setMany: async (values) => cache.mset(values),
    deleteMany: async (keys) => cache.del(keys),
    deleteByPrefix: async (prefix) =>
      cache
        .keys()
        .filter((key) => key.startsWith(prefix))
        .forEach((key) => cache.del(key)),
  };

  return leemonsCache;
};
