import type { EmailTemplate } from './helpers/addEmailTemplates';
import { addEmailTemplates } from './helpers/addEmailTemplates';

interface LeemonsEmailsMixinOptions {
  ctxKeyValueModelName?: string;
}

interface LeemonsEmailsMixinContext {
  name: string;
  version?: string;
  logger: {
    debug: (message: string) => void;
    error: (message: string, error: unknown) => void;
    info: (message: string) => void;
  };
  broker: {
    waitForServices: (service: string) => Promise<void>;
    call: (service: string, params: unknown, options: unknown) => Promise<unknown>;
  };
  metadata: {
    mixins: {
      LeemonsEmailsMixin: boolean;
    };
    LeemonsMongoDBMixin: {
      models: (options: {
        ctx: {
          service: {
            name: string;
          };
          meta: {
            deploymentID: string;
          };
        };
        autoTransaction: boolean;
        autoLRN: boolean;
        autoDeploymentID: boolean;
      }) => Record<string, any>; // TODO: Add proper type from @leemons/mongodb
    };
  };
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
      async initEmailTemplates(this: LeemonsEmailsMixinContext, templates: EmailTemplate[]) {
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
        })[ctxKeyValueModelName];

        await addEmailTemplates.call(this, { KeyValuesModel, templates });
      },
    },
    created(this: LeemonsEmailsMixinContext) {
      this.logger.debug('LeemonsEmailsMixin created');
    },
  };
}
