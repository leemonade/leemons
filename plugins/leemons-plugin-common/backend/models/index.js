/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./currentVersions'),
  ...require('./tags'),
  ...require('./versions'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      CurrentVersions: models.currentVersionsModel,
      Tags: models.tagsModel,
      Versions: models.versionsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::common_KeyValue' }),
    };
  },
};
