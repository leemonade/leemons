/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./attachments'),
  ...require('./groups'),
  ...require('./groupsInstances'),
  ...require('./instances'),
  ...require('./profiles'),
  ...require('./settings'),
  ...require('./tags'),
  ...require('./taskAssessmentCriteria'),
  ...require('./taskContents'),
  ...require('./taskObjectives'),
  ...require('./tasks'),
  ...require('./taskSubjects'),
  ...require('./tasksVersioning'),
  ...require('./tasksVersions'),
  ...require('./teacherInstances'),
  ...require('./userDeliverables'),
  ...require('./userInstances'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Attachments: models.attachmentsModel,
      Groups: models.groupsModel,
      GroupsInstances: models.groupsInstancesModel,
      Instances: models.instancesModel,
      Profiles: models.profilesModel,
      Settings: models.settingsModel,
      Tags: models.tagsModel,
      TaskAssessmentCriteria: models.taskAssessmentCriteriaModel,
      TaskContents: models.taskContentsModel,
      TaskObjectives: models.taskObjectivesModel,
      Tasks: models.tasksModel,
      TaskSubjects: models.taskSubjectsModel,
      TasksVersioning: models.tasksVersioningModel,
      TasksVersions: models.tasksVersionsModel,
      TeacherInstances: models.teacherInstancesModel,
      UserDeliverables: models.userDeliverablesModel,
      UserInstances: models.userInstancesModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::tasks_KeyValue' }),
    };
  },
};
