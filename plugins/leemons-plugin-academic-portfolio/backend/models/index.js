/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./class'),
  ...require('./programs'),
  ...require('./subject-types'),
  ...require('./knowledges'),
  ...require('./groups'),
  ...require('./class-course'),
  ...require('./class-group'),
  ...require('./class-knowledges'),
  ...require('./class-student'),
  ...require('./class-substage'),
  ...require('./class-teacher'),
  ...require('./subjects'),
  ...require('./program-center'),
  ...require('./cycles'),
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
      ClassCourse: models.classCourseModel,
      ClassGroup: models.classGroupModel,
      ClassKnowledges: models.classKnowledgesModel,
      ClassStudent: models.classStudentModel,
      ClassSubstage: models.classSubstageModel,
      ClassTeacher: models.ClassTeacher,
      Subjects: models.subjectsModel,
      ProgramCenter: models.programCenterModel,
      Cycles: models.cyclesModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::academic-portfolio_KeyValue' }),
    };
  },
};
