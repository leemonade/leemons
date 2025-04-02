import type { Redis } from 'ioredis';

interface QueriesBaseConstructor {
  client: Redis;
  isCluster: boolean;
  pluginName: string;
}

export class QueriesBase {
  protected client: Redis;
  protected isCluster: boolean;
  protected pluginName: string;

  constructor({ client, isCluster, pluginName }: QueriesBaseConstructor) {
    this.client = client;
    this.isCluster = isCluster;
    this.pluginName = pluginName;
  }

  protected generateKey({ key }: { key: string }): string {
    return `{plugin.${this.pluginName}}.${key}`;
  }

  protected cleanKey({ key }: { key: string }): string {
    return key.replace(new RegExp(`^\\{plugin\\.${this.pluginName}\\}\\.`), '');
  }
}
