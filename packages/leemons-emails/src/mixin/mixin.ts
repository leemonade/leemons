import type { ServiceSchema } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';
import type { EmailTemplate } from './helpers/addEmailTemplates';
import { addEmailTemplates } from './helpers/addEmailTemplates';

interface LeemonsEmailsMixinOptions {
  ctxKeyValueModelName?: string;
}

export function LeemonsEmailsMixin({
  ctxKeyValueModelName = 'KeyValue',
}: LeemonsEmailsMixinOptions = {}) {
  return {
    name: '',
    metadata: {
      mixins: {
        LeemonsEmailsMixin: true,
      },
    },
    methods: {
      async initEmailTemplates(this: ServiceSchema, templates: EmailTemplate[]) {
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

        await addEmailTemplates.call(this, { KeyValuesModel, templates });
      },
    },
    created(this: ServiceSchema) {
      this.logger.debug('LeemonsEmailsMixin created');
    },
  };
}
