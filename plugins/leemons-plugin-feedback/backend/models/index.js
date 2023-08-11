/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./feedback-dates'),
  ...require('./feedback-questions'),
  ...require('./feedback-responses'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      FeedbackModel: models.feedbackModel,
      FeedbackQuestions: models.feedbackQuestionsModel,
      FeedbackResponses: models.feedbackResponsesModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::feedback_KeyValue' }),
    };
  },
};
