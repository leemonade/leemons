/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./dataset-values'),
  ...require('./dataset'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      DatasetValues: models.datasetValuesModel,
      Dataset: models.datasetModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::dataset_KeyValue' }),
    };
  },
};
