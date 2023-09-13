/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      KeyValue: getKeyValueModel({ modelName: 'v1::layout_KeyValue' }),
    };
  },
};
