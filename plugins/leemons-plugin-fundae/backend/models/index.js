/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./report'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Report: models.reportModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::fundae_KeyValue' }),
    };
  },
};
