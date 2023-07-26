/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./widgetItem'),
  ...require('./widgetItemProfiles'),
  ...require('./widgetZone'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      WidgetItem: models.widgetItemModel,
      WidgetItemProfiles: models.widgetItemProfilesModel,
      WidgetZone: models.widgetZoneModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::widgets_KeyValue' }),
    };
  },
};
