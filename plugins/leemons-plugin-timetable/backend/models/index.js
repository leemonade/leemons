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
  Breaks: models.breaksModel,
  Config: models.configModel,
  Settings: models.settingsModel,
  Timetable: models.timetableModel,
  getServiceModels() {
    return {
      Actions: models.actionsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::timetable_KeyValue' }),
    };
  },
};
