const { getKeyValueModel } = require('leemons-mongodb-helpers');

const assignablesModels = require('./assignables');
const rolesModels = require('./roles');

const models = {
  ...assignablesModels,
  ...rolesModels,
};

module.exports = {
  ...models,
  getServiceModels: () => ({
    KeyValue: getKeyValueModel({ modelName: 'v1::assignables_KeyValue' }),
    Assignables: models.assignablesModel,
  }),
};
