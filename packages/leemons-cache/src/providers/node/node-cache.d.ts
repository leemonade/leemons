declare module "node-cache" {
  interface NodeCache {
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T, ttl?: number): boolean;
    has(key: string): boolean;
    del(key: string | string[]): number;
    mget<T>(keys: string[]): { [key: string]: T };
    mset(values: { key: string; val: any; ttl?: number }[]): boolean;
    keys(): string[];
  }

  class NodeCache {
    constructor(options?: { stdTTL?: number; checkperiod?: number });
  }

  export = NodeCache;
}
