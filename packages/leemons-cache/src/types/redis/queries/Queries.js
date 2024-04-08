const { isEmpty } = require('lodash');
const NamespaceQueries = require('./Namespace');

class Queries extends NamespaceQueries {
  async set(key, value, ttl) {
    const _key = this.generateKey({ key });

    await this.saveKeyToNamespace({ key: _key });
    const response = this.client.set(_key, JSON.stringify(value));

    if (ttl) {
      await this.client.expire(_key, ttl);
    }

    return response;
  }

  async get(key) {
    const value = await this.client.get(this.generateKey({ key }));

    return !value ? null : JSON.parse(value);
  }

  async has(key) {
    return this.client.exists(this.generateKey({ key }));
  }

  async delete(key) {
    if (Array.isArray(key)) {
      throw new Error('Delete only supports single key deletions');
    }

    if (isEmpty(key)) {
      return 0;
    }

    const _key = this.generateKey({ key });

    await this.deleteKeysFromNamespace({ keys: [_key] });
    return this.client.del(_key);
  }

  // Multi functions

  async setMany(values) {
    const trx = this.client.multi();

    values.forEach(({ key: _key, val, ttl }) => {
      const key = this.generateKey({ key: _key });

      this.saveKeyToNamespace({ key });

      trx.set(key, JSON.stringify(val));

      if (ttl) {
        trx.expire(key, ttl);
      }
    });

    return trx.exec();
  }

  async getMany(keys) {
    const _keys = keys.map((key) => this.generateKey({ key }));

    if (!keys.length) {
      return {};
    }

    const values = await this.client.mget(_keys);

    const result = {};
    values.forEach((value, i) => {
      if (value) {
        const key = this.cleanKey({ key: _keys[i] });
        result[key] = JSON.parse(value);
      }
    });

    return result;
  }

  async hasMany(keys) {
    const trx = this.client.multi();
    const _keys = keys.map((key) => this.generateKey({ key }));

    _keys.forEach((key) => {
      trx.exists(key);
    });

    const hasKeys = await trx.exec();

    const hasKeysObject = {};

    hasKeys.forEach((result, i) => {
      const key = this.cleanKey({ key: keys[i] });
      hasKeysObject[key] = !!result;
    });

    return hasKeysObject;
  }

  async deleteMany(keys) {
    const _keys = keys.map((key) => this.generateKey({ key }));

    if (isEmpty(_keys)) {
      return 0;
    }

    await this.deleteKeysFromNamespace({ keys: _keys });
    return this.client.del(_keys);
  }
}

module.exports = Queries;
