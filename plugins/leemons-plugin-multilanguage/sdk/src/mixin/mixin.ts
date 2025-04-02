import type { ServiceSchema } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';
import type { LeemonsMongoDBMixin, MultilanguageOptions } from '../types';
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
      LeemonsMongoDBMixin: {} as LeemonsMongoDBMixin,
    },
    async started() {
      const KeyValuesModel = this.metadata.LeemonsMongoDBMixin.models({
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
      })[ctxKeyValueModelName] as Model<GetKeyValueModel>;

      await loadLocalizations.call(this, { KeyValuesModel, locales, i18nPath });
    },
  };
}
