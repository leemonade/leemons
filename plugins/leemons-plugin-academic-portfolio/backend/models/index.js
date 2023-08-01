/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./class-course'),
  ...require('./class-group'),
  ...require('./class-knowledges'),
  ...require('./class-student'),
  ...require('./class-substage'),
  ...require('./class-teacher'),
  ...require('./class'),
  ...require('./configs'),
  ...require('./cycles'),
  ...require('./groups'),
  ...require('./knowledges'),
  ...require('./managers'),
  ...require('./program-center'),
  ...require('./program-subjects-credits'),
  ...require('./programs'),
  ...require('./settings'),
  ...require('./subject-types'),
  ...require('./subjects'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      ClassCourse: models.classCourseModel,
      ClassGroup: models.classGroupModel,
      ClassKnowledges: models.classKnowledgesModel,
      ClassStudent: models.classStudentModel,
      ClassSubstage: models.classSubstageModel,
      ClassTeacher: models.ClassTeacher,
      Class: models.classModel,
      Configs: models.configsModel,
      Cycles: models.cyclesModel,
      Groups: models.groupsModel,
      Knowledges: models.knowledgesModel,
      Managers: models.managersModel,
      ProgramCenter: models.programCenterModel,
      ProgramSubjectsCredits: models.programSubjectsCreditsModel,
      Programs: models.programsModel,
      Settings: models.settingsModel,
      SubjectTypes: models.subjectTypesModel,
      Subjects: models.subjectsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::academic-portfolio_KeyValue' }),
    };
  },
};
