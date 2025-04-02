import { isEmpty } from 'lodash';
import { NamespaceQueries } from './Namespace';

interface SetManyValue {
  key: string;
  val: any;
  ttl?: number;
}

export class Queries extends NamespaceQueries {
  async set(key: string, value: any, ttl?: number): Promise<'OK'> {
    const _key = this.generateKey({ key });

    await this.saveKeyToNamespace({ key: _key });
    const response = await this.client.set(_key, JSON.stringify(value));

    if (ttl) {
      await this.client.expire(_key, ttl);
    }

    return response;
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(this.generateKey({ key }));

    return !value ? null : JSON.parse(value);
  }

  async has(key: string): Promise<number> {
    return this.client.exists(this.generateKey({ key }));
  }

  async delete(key: string): Promise<number> {
    if (Array.isArray(key)) {
      throw new Error('Delete only supports single key deletions');
    }

    if (isEmpty(key)) {
      return 0;
    }

    const _key = this.generateKey({ key });

    await this.deleteKeysFromNamespace({
      keys: [_key],
      namespace: this.getNamespaceFromKey({ key: _key }) || '',
    });
    return this.client.del(_key);
  }

  // Multi functions

  async setMany(values: SetManyValue[]): Promise<Array<[Error | null, any]> | null> {
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

  async getMany(keys: string[]): Promise<Record<string, any>> {
    const _keys = keys.map((key) => this.generateKey({ key }));

    if (!keys.length) {
      return {};
    }

    const values = await this.client.mget(_keys);

    const result: Record<string, any> = {};
    values.forEach((value, i) => {
      if (value) {
        const key = this.cleanKey({ key: _keys[i] });
        result[key] = JSON.parse(value);
      }
    });

    return result;
  }

  async hasMany(keys: string[]): Promise<Record<string, boolean>> {
    const trx = this.client.multi();
    const _keys = keys.map((key) => this.generateKey({ key }));

    _keys.forEach((key) => {
      trx.exists(key);
    });

    const hasKeys = await trx.exec();

    const hasKeysObject: Record<string, boolean> = {};

    hasKeys?.forEach((result, i) => {
      const key = this.cleanKey({ key: keys[i] });
      hasKeysObject[key] = !!(result && result[1]);
    });

    return hasKeysObject;
  }

  async deleteMany(keys: string[]): Promise<number> {
    const _keys = keys.map((key) => this.generateKey({ key }));

    if (isEmpty(_keys)) {
      return 0;
    }

    const namespace = this.getNamespaceFromKey({ key: _keys[0] }) || '';
    await this.deleteKeysFromNamespace({ keys: _keys, namespace });
    return this.client.del(_keys);
  }
}
