/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./config'),
  ...require('./regional-config'),
  ...require('./custom-period'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Config: models.configModel,
      RegionalConfig: models.regionalConfigModel,
      CustomPeriod: models.customPeriodModel,
      //
      KeyValue: getKeyValueModel({ modelName: 'v1::academic-calendar_KeyValue' }),
    };
  },
};
