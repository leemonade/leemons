/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./documents'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Documents: models.documentsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::content-creator_KeyValue' }),
    };
  },
};
