/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./assistance'),
  ...require('./session'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Assistance: models.assistanceModel,
      Session: models.sessionModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::attendance-control_KeyValue' }),
    };
  },
};
