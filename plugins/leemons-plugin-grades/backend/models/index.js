/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./condition-groups'),
  ...require('./conditions'),
  ...require('./grade-scales'),
  ...require('./grade-tags'),
  ...require('./grades'),
  ...require('./rules'),
  ...require('./settings'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      ConditionGroups: models.conditionGroupsModel,
      Conditions: models.conditionsModel,
      GradeScales: models.gradeScalesModel,
      GradeTags: models.gradeTagsModel,
      Grades: models.gradesModel,
      Rules: models.rulesModel,
      Settings: models.settingsModel,

      KeyValue: getKeyValueModel({ modelName: 'v1::grades_KeyValue' }),
    };
  },
};
