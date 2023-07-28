/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./knowHowToUse'),
  ...require('./menuItem'),
  ...require('./menu'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      KnowHowToUse: models.knowHowToUseModel,
      MenuItem: models.menuItemModel,
      Menu: models.menuModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::menu-builder_KeyValue' }),
    };
  },
};
