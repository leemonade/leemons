const { isEmpty } = require('lodash');

function generateKey(key, pluginName) {
  return `${pluginName}.${key}`;
}

function cleanKey(key, pluginName) {
  return key.replace(new RegExp(`^${pluginName}\\.`), '');
}

module.exports = function queries(client) {
  return (pluginName) => ({
    get: async (key) => {
      const value = await client.get(generateKey(key, pluginName));

      return !value ? null : JSON.parse(value);
    },
    has: async (key) => client.exists(generateKey(key, pluginName)),
    set: async (key, value, ttl) =>
      client.set(generateKey(key, pluginName), JSON.stringify(value), { EX: ttl || undefined }),
    delete: async (key) => {
      if (Array.isArray(key)) {
        throw new Error('Delete only supports single key deletions');
      }

      if (isEmpty(key)) {
        return 0;
      }

      return client.del(generateKey(key, pluginName));
    },

    getMany: async (keys) => {
      const _keys = keys.map((key) => generateKey(key, pluginName));

      const values = await client.mGet(_keys);

      const result = {};
      values.forEach((value, i) => {
        if (value) {
          const key = cleanKey(_keys[i], pluginName);
          result[key] = JSON.parse(value);
        }
      });

      return result;
    },
    hasMany: async (keys) => {
      const trx = client.multi();
      const _keys = keys.map((key) => generateKey(key, pluginName));

      _keys.forEach((key) => trx.exists(key));

      const hasKeys = await trx.exec();

      const hasKeysObject = {};

      hasKeys.forEach((result, i) => {
        const key = cleanKey(keys[i], pluginName);
        hasKeysObject[key] = !!result;
      });

      return hasKeysObject;
    },
    setMany: async (values) => {
      const trx = client.multi();

      values.forEach(({ key, val, ttl }) =>
        trx.set(generateKey(key, pluginName), JSON.stringify(val), { EX: ttl })
      );

      return trx.exec();
    },
    deleteMany: async (keys) => client.del(keys.map((key) => generateKey(key, pluginName))),
    deleteByPrefix: async (prefix) => {
      const _prefix = generateKey(prefix.replaceAll('*', '\\*'), pluginName);
      const keys = await client.keys(`${_prefix}*`);

      if (isEmpty(keys)) {
        return 0;
      }

      return client.del(keys);
    },
  });
};
