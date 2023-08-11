/* eslint-disable global-require */
const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./message-config-centers'),
  ...require('./message-config-classes'),
  ...require('./message-config-clicks'),
  ...require('./message-config-profiles'),
  ...require('./message-config-programs'),
  ...require('./message-config-views'),
  ...require('./message-config'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      MessageConfigCenters: models.messageConfigCentersModel,
      MessageConfigClasses: models.messageConfigClassesModel,
      MessageConfigClicks: models.messageConfigClicksModel,
      MessageConfigProfiles: models.messageConfigProfilesModel,
      MessageConfigPrograms: models.messageConfigProgramsModel,
      MessageConfigViews: models.messageConfigViewsModel,
      MessageConfig: models.messageConfigModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::board-messages_KeyValue' }),
    };
  },
};
