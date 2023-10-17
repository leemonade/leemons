/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./config'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Config: models.configModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::emails-aws-ses_KeyValue' }),
    };
  },
};
