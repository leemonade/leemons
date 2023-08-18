/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./scorm-progress'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      ScormProgress: models.scormProgressModel,
      //
      KeyValue: getKeyValueModel({ modelName: 'v1::scorm_KeyValue' }),
    };
  },
};
