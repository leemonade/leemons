import type { Redis } from 'ioredis';
import { isFunction } from 'lodash';
import { QueriesBase } from './QueriesBase';

const GLOBAL_NAMESPACE = 'leemons.cache.namespaces';
const NAMESPACE = (namespace: string): string => `${GLOBAL_NAMESPACE}.${namespace}`;
const namespaceHasSeparatorError = (namespace: string, separator: string): Error =>
  new Error(`Namespace ${namespace} has a "${separator}" in it, which is not allowed`);

interface NamespaceQueriesConstructor {
  separator?: string;
  client: Redis;
  isCluster: boolean;
  pluginName: string;
}

export class NamespaceQueries extends QueriesBase {
  #registeredNamespaces = new Map<string, boolean>();
  protected separator: string;

  constructor({ separator = ':', ...rest }: NamespaceQueriesConstructor) {
    super(rest);
    this.separator = separator;
  }

  protected async isNamespaceRegistered({ namespace }: { namespace: string }): Promise<boolean> {
    if (this.#registeredNamespaces.has(namespace)) {
      return true;
    }

    const response = await this.client.sismember(GLOBAL_NAMESPACE, namespace);

    if (response) {
      this.#registeredNamespaces.set(namespace, true);
    }

    return !!response;
  }

  async registerNamespace({ namespace: _namespace }: { namespace: string }): Promise<void> {
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

  protected getNamespaceFromKey({ key }: { key: string }): string | null {
    // Remove LRN pattern from key
    const cleanedKey = key.replace(/lrn:[^:]+/, 'LRN');

    const parts = cleanedKey.split(this.separator);
    if (parts.length === 1) {
      return null;
    }

    return parts[0];
  }

  protected async isKeyInNamespace({ key }: { key: string }): Promise<boolean> {
    const namespace = this.getNamespaceFromKey({ key });

    if (!namespace) {
      return false;
    }

    const result = await this.client.sismember(NAMESPACE(namespace), key);
    return !!result;
  }

  protected async saveKeyToNamespace({ key }: { key: string }): Promise<boolean> {
    const namespace = this.getNamespaceFromKey({ key });
    const isAlreadySaved = await this.isKeyInNamespace({ key });
    const namespaceExists = namespace ? await this.isNamespaceRegistered({ namespace }) : false;

    if (!namespace || isAlreadySaved || !namespaceExists) {
      return isAlreadySaved;
    }

    await this.client.sadd(NAMESPACE(namespace), key);

    return true;
  }

  protected async deleteKeysFromNamespace({
    keys,
    namespace,
  }: {
    keys: string[];
    namespace: string;
  }): Promise<number> {
    return this.client.srem(NAMESPACE(namespace), keys);
  }

  protected async getKeysInNamespace({ namespace }: { namespace: string }): Promise<string[]> {
    return this.client.smembers(NAMESPACE(namespace));
  }

  async deleteByNamespace(_namespace: string, filter?: (key: string) => boolean): Promise<number> {
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
