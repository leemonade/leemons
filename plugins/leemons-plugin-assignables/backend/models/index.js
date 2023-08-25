const { getKeyValueModel } = require('leemons-mongodb-helpers');

const { assignablesModel } = require('./assignables');
const { rolesModel } = require('./roles');
const { subjectsModel } = require('./subjects');

const models = {
  assignablesModel,
  rolesModel,
  subjectsModel,
};

module.exports = {
  ...models,
  getServiceModels: () => ({
    KeyValue: getKeyValueModel({ modelName: 'v1::assignables_KeyValue' }),
    Assignables: models.assignablesModel,
    Roles: models.rolesModel,
    Subjects: models.subjectsModel,
  }),
};
