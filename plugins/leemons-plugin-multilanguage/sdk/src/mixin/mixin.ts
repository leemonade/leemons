import type { ServiceSchema } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';
import type { MultilanguageOptions } from '../types';
import { loadLocalizations } from './helpers/loadLocalizations';

export function LeemonsMultilanguageMixin({
  ctxKeyValueModelName = 'KeyValue',
  locales,
  i18nPath,
}: MultilanguageOptions = {}): ServiceSchema {
  return {
    name: '',
    metadata: {
      mixins: {
        LeemonsMultilanguageMixin: true,
      },
    },
    async started() {
      const KeyValuesModel: Model<GetKeyValueModel> = this.metadata.LeemonsMongoDBMixin.models({
        ctx: {
          service: {
            name: this.name,
          },
          meta: {
            deploymentID: 'global',
          },
        },
        autoTransaction: false,
        autoLRN: true,
        autoDeploymentID: true,
      })[ctxKeyValueModelName];

      await loadLocalizations.call(this, { KeyValuesModel, locales, i18nPath });
    },
  };
}
