import type { Context } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';

export interface MultilanguageOptions {
  /** The name of the key-value model to use for storing translations. Defaults to 'KeyValue' */
  ctxKeyValueModelName?: string;
  /** Array of locale codes to load translations for */
  locales?: string[];
  /** Path to the i18n files */
  i18nPath?: string;
}

export interface LeemonsMongoDBMixinModels {
  (options: {
    ctx: Context;
    autoTransaction: boolean;
    autoLRN: boolean;
    autoDeploymentID: boolean;
  }): Record<string, Model<GetKeyValueModel>>;
}

export interface LeemonsMongoDBMixin {
  models: LeemonsMongoDBMixinModels;
}

export interface ServiceMetadata {
  mixins: {
    LeemonsMultilanguageMixin: boolean;
  };
  LeemonsMongoDBMixin: LeemonsMongoDBMixin;
}
