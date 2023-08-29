const { getKeyValueModel } = require('leemons-mongodb-helpers');

const { assignablesModel } = require('./assignables');
const { rolesModel } = require('./roles');
const { subjectsModel } = require('./subjects');
const { instancesModel } = require('./instances');
const { assignationsModel } = require('./assignations');
const { classesModel } = require('./classes');
const { datesModel } = require('./dates');
const { gradesModel } = require('./grades');
const { teachersModel } = require('./teachers');

const models = {
  rolesModel,
  assignablesModel,
  instancesModel,
  assignationsModel,
  subjectsModel,
  classesModel,
  datesModel,
  gradesModel,
  teachersModel,
};

module.exports = {
  ...models,
  getServiceModels: () => ({
    KeyValue: getKeyValueModel({ modelName: 'v1::assignables_KeyValue' }),
    Roles: models.rolesModel,
    Assignables: models.assignablesModel,
    Instances: models.instancesModel,
    Assignations: models.assignationsModel,
    Subjects: models.subjectsModel,
    Classes: models.classesModel,
    Dates: models.datesModel,
    Grades: models.gradesModel,
    Teachers: models.teachersModel,
  }),
};
