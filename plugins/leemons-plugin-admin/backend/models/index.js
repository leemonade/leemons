/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./settings'),
  ...require('./theme'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Settings: models.settingsModel,
      Theme: models.themeModel,
      KeyValue: getKeyValueModel({ modelName: 'admin_KeyValue' }),
    };
  },
};
