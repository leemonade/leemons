const { LRNRegex } = require('@leemons/lrn');
const { isFunction } = require('lodash');
const QueriesBase = require('./QueriesBase');

const GLOBAL_NAMESPACE = 'leemons.cache.namespaces';
const NAMESPACE = (namespace) => `${GLOBAL_NAMESPACE}.${namespace}`;
const namespaceHasSeparatorError = (namespace, separator) =>
  new Error(`Namespace ${namespace} has a "${separator}" in it, which is not allowed`);

class NamespaceQueries extends QueriesBase {
  #registeredNamespaces = new Map();

  constructor({ separator = ':', ...rest }) {
    super(rest);
    this.separator = separator;
  }

  async isNamespaceRegistered({ namespace }) {
    if (this.#registeredNamespaces.has(namespace)) {
      return true;
    }

    const response = await this.client.sismember(GLOBAL_NAMESPACE, namespace);

    if (response) {
      this.#registeredNamespaces.set(namespace, true);
    }

    return response;
  }

  async registerNamespace({ namespace: _namespace }) {
    if (_namespace.includes(this.separator)) {
      throw namespaceHasSeparatorError(_namespace, this.separator);
    }

    const namespace = this.generateKey({ key: _namespace });
    if (await this.isNamespaceRegistered({ namespace })) {
      return;
    }

    this.#registeredNamespaces.set(namespace, true);
    await this.client.sadd(GLOBAL_NAMESPACE, namespace);
  }

  getNamespaceFromKey({ key }) {
    key.replace(LRNRegex, 'LRN');

    const parts = key.split(this.separator);
    if (parts.length === 1) {
      return null;
    }

    return parts[0];
  }

  async isKeyInNamespace({ key }) {
    const namespace = this.getNamespaceFromKey({ key });

    if (!namespace) {
      return false;
    }

    return this.client.sismember(NAMESPACE(namespace), key);
  }

  async saveKeyToNamespace({ key }) {
    const namespace = this.getNamespaceFromKey({ key });
    const isAlreadySaved = await this.isKeyInNamespace({ key });
    const namespaceExists = await this.isNamespaceRegistered({ namespace });

    if (!namespace || isAlreadySaved || !namespaceExists) {
      return isAlreadySaved;
    }

    await this.client.sadd(NAMESPACE(namespace), key);

    return true;
  }

  async deleteKeysFromNamespace({ keys, namespace }) {
    return this.client.srem(NAMESPACE(namespace), keys);
  }

  async getKeysInNamespace({ namespace }) {
    return this.client.smembers(NAMESPACE(namespace));
  }

  async deleteByNamespace(_namespace, filter) {
    if (_namespace.includes(this.separator)) {
      throw namespaceHasSeparatorError(_namespace, this.separator);
    }

    const namespace = this.generateKey({ key: _namespace });
    let keys = await this.getKeysInNamespace({ namespace });

    if (isFunction(filter)) {
      keys = keys.filter((key) => filter(this.cleanKey({ key })));
    }

    if (!keys.length) {
      return 0;
    }

    await this.deleteKeysFromNamespace({ keys, namespace });
    return this.client.del(keys);
  }
}

module.exports = NamespaceQueries;
