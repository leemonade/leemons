/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./feedback-dates'),
  ...require('./feedback-questions'),
  ...require('./feedback-responses'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      FeedbackDates: models.feedbackDatesModel,
      FeedbackQuestions: models.feedbackQuestionsModel,
      FeedbackResponse: models.feedbackResponsesModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::feedback_KeyValue' }),
    };
  },
};
