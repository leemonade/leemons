/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

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
  ...require('./knowledgeAreas'),
  ...require('./managers'),
  ...require('./program-center'),
  ...require('./program-subjects-credits'),
  ...require('./programs'),
  ...require('./settings'),
  ...require('./subject-types'),
  ...require('./subjects'),
  ...require('./blocks'),
  ...require('./program-staff'),
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
      ClassTeacher: models.classTeacherModel,
      Class: models.classModel,
      Configs: models.configsModel,
      Cycles: models.cyclesModel,
      Groups: models.groupsModel,
      KnowledgeAreas: models.knowledgeAreasModel,
      Managers: models.managersModel,
      ProgramCenter: models.programCenterModel,
      ProgramSubjectsCredits: models.programSubjectsCreditsModel,
      Programs: models.programsModel,
      Settings: models.settingsModel,
      SubjectTypes: models.subjectTypesModel,
      Subjects: models.subjectsModel,
      Blocks: models.blocksModel,
      ProgramStaff: models.programStaffModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::academic-portfolio_KeyValue' }),
    };
  },
};
