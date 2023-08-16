/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./assignSavedConfig'),
  ...require('./question-bank-categories'),
  ...require('./question-bank-subjects'),
  ...require('./questions'),
  ...require('./questions-banks'),
  ...require('./questions-tests'),
  ...require('./tests'),
  ...require('./user-agent-assignable-instance-responses'),
  ...require('./user-feedback'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      AssignSavedConfig: models.assignSavedConfigModel,
      QuestionBankCategories: models.questionBankCategoriesModel,
      QuestionBankSubjects: models.questionBankSubjectsModel,
      Questions: models.questionsModel,
      QuestionsBanks: models.questionsBanksModel,
      QuestionsTests: models.questionsTestsModel,
      Tests: models.testsModel,
      UserAgentAssignableInstanceResponses: models.UserAgentAssignableInstanceResponsesModel,
      UserFeedback: models.userFeedbackModel,

      KeyValue: getKeyValueModel({ modelName: 'v1::tests_KeyValue' }),
    };
  },
};
