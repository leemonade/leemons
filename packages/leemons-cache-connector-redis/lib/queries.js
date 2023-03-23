const { map } = require('lodash');

module.exports = function queries(client) {
  return {
    get: async (key) => {
      const value = await client.get(key);

      return !value ? null : JSON.parse(value);
    },
    has: async (key) => client.exists(key),
    set: async (key, value, ttl) =>
      client.set(key, JSON.stringify(value), { EX: ttl || undefined }),
    delete: async (key) => {
      if (Array.isArray(key)) {
        throw new Error('Delete only supports single key deletions');
      }
      return client.del(key);
    },

    getMany: async (keys) => {
      const values = await client.mGet(keys);

      const result = {};
      values.forEach((value, i) => {
        if (value) {
          const key = keys[i];
          result[key] = JSON.parse(value);
        }
      });

      return result;
    },
    hasMany: async (keys) => {
      const trx = client.multi();

      keys.forEach((key) => trx.exists(key));

      const hasKeys = await trx.exec();

      const hasKeysObject = {};

      hasKeys.forEach((result, i) => {
        const key = keys[i];
        hasKeysObject[key] = !!result;
      });

      return hasKeysObject;
    },
    setMany: async (values) => {
      const trx = client.multi();

      values.forEach(({ key, val, ttl }) => trx.set(key, JSON.stringify(val), { EX: ttl }));

      return trx.exec();
    },
    deleteMany: async (keys) => client.del(keys),
    deleteByPrefix: async (prefix) => {
      const keys = await client.keys(prefix.replaceAll('*', '\\*'));
      return client.del(keys);
    },
  };
};
