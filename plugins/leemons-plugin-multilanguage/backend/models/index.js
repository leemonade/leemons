/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./common'),
  ...require('./locales'),
  ...require('./contents'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Common: models.commonModel,
      Locales: models.localesModel,
      Contents: models.contentsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::multilanguage_KeyValue' }),
    };
  },
};
