/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./periods'),
  ...require('./scores'),
  ...require('./weights'),
  ...require('./manualActivities'),
  ...require('./manualActivityScores'),
  ...require('./retakes'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Periods: models.periodsModel,
      Scores: models.scoresModel,
      Weights: models.weightsModel,
      ManualActivities: models.manualActivitiesModel,
      ManualActivityScores: models.manualActivityScoresModel,
      Retakes: models.retakesModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::scores_KeyValue' }),
    };
  },
};
