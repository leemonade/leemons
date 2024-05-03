/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./welcomeCompleted'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      WelcomeCompleted: models.WelcomeCompletedModel,

      KeyValue: getKeyValueModel({ modelName: 'v1::dashboard_KeyValue' }),
    };
  },
};
