const { addEmailTemplates } = require('./helpers/addEmailTemplates');

module.exports = function LeemonsEmailsMixin({ ctxKeyValueModelName = 'KeyValue' } = {}) {
  return {
    name: '',
    metadata: {
      mixins: {
        LeemonsEmailsMixin: true,
      },
    },
    methods: {
      async initEmailTemplates(templates) {
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
    created() {
      this.logger.info('LeemonsEmailsMixin created');
    },
  };
};
