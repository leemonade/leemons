/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./profiles'),
  ...require('./settings'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Profiles: models.profilesModel,
      Settings: models.settingsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::tasks_KeyValue' }),
    };
  },
};
