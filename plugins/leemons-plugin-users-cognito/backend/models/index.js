const { getKeyValueModel } = require('@leemons/mongodb-helpers');
const { MODELS_PREFIX } = require('../config/constants');
const { userPoolModel } = require('./userPool');

const models = {
  UserPool: userPoolModel,
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      ...models,
      KeyValue: getKeyValueModel({
        modelName: `${MODELS_PREFIX}_KeyValue`,
      }),
    };
  },
};
