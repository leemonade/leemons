/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./common'),
  ...require('./locales'),
  ...require('./contents'),
  ...require('./globals'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Common: models.commonModel,
      Locales: models.localesModel,
      Contents: models.contentsModel,
      Globals: models.globalsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::multilanguage_KeyValue' }),
    };
  },
};
