/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./periods'),
  ...require('./scores'),
  ...require('./weights'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Periods: models.periodsModel,
      Scores: models.scoresModel,
      Weights: models.weightsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::scores_KeyValue' }),
    };
  },
};
