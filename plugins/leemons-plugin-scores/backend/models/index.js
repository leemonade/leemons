/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./periods'),
  ...require('./scores'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Periods: models.periodsModel,
      Scores: models.scoresModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::scores_KeyValue' }),
    };
  },
};
