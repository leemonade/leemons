/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./breaks'),
  ...require('./config'),
  ...require('./settings'),
  ...require('./timetable'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Actions: models.actionsModel,
      Breaks: models.breaksModel,
      Config: models.configModel,
      Settings: models.settingsModel,
      Timetable: models.timetableModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::timetable_KeyValue' }),
    };
  },
};
