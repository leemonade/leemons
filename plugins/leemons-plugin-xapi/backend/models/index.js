/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./statement'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Statement: models.statementModel,
      //
      KeyValue: getKeyValueModel({ modelName: 'v1::xapi_KeyValue' }),
    };
  },
};
