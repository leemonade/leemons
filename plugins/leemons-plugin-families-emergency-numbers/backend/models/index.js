/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./emergency-phones'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      EmergencyPhones: models.emergencyPhonesModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::families-emergency-numbers_KeyValue' }),
    };
  },
};
