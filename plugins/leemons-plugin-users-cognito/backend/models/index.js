const { getKeyValueModel } = require('@leemons/mongodb-helpers');
const { MODELS_PREFIX } = require('../config/constants');

const models = {};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      KeyValue: getKeyValueModel({
        modelName: `${MODELS_PREFIX}_KeyValue`,
      }),
    };
  },
};
