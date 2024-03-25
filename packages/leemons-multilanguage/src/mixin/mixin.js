const { loadLocalizations } = require('./helpers/loadLocalizations');

module.exports = function LeemonsMultilanguageMixin({
  ctxKeyValueModelName = 'KeyValue',
  locales,
  i18nPath,
} = {}) {
  return {
    name: '',
    metadata: {
      mixins: {
        LeemonsMultilanguageMixin: true,
      },
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
      })[ctxKeyValueModelName];
      await loadLocalizations.call(this, { KeyValuesModel, locales, i18nPath });
    },
  };
};
