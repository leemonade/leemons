/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./class'),
  ...require('./programs'),
  ...require('./subject-types'),
  ...require('./knowledges'),
  ...require('./groups'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Class: models.classModel,
      Programs: models.programsModel,
      SubjectTypes: models.subjectTypesModel,
      Knowledges: models.knowledgesModel,
      Groups: models.groupsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::academic-portfolio_KeyValue' }),
    };
  },
};
