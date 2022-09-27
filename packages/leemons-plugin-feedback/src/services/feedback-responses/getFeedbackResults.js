const _ = require('lodash');
const { table } = require('../tables');

async function getFeedbackResults(id, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const [feedbackDates, feedbackResponses, feedbackQuestions] = await Promise.all([
        table.feedbackDates.find({ instance: id }, { transacting }),
        table.feedbackResponse.find({ instance: id }, { transacting }),
      ]);

      // General info of feedback
      let numberOfStartedFeedback = 0;
      let numberOfFinishedFeedback = 0;
      feedbackDates.forEach(({ startDate, endDate }) => {
        if (startDate) numberOfStartedFeedback++;
        if (endDate) numberOfFinishedFeedback++;
      });

      const completionPercentage = Math.trunc(
        (numberOfFinishedFeedback / feedbackDates.length) * 100
      );

      let totalTimeToFinishOfFeedback = 0;
      feedbackDates.forEach(({ timeToFinish }) => {
        if (timeToFinish) totalTimeToFinishOfFeedback += timeToFinish;
      });
      const avgTimeOfCompletion = totalTimeToFinishOfFeedback / numberOfFinishedFeedback;

      const feedbackGeneralInfo = {
        started: numberOfStartedFeedback,
        finished: numberOfFinishedFeedback,
        completionPercentage,
        avgTimeOfCompletion,
      };

      // Info of responses
      const questionResponses = _.groupBy(feedbackResponses, 'question');
      const questions = await table.feedbackQuestions.find(
        {
          id_$in: Object.keys(questionResponses),
        },
        { transacting }
      );

      const questionsInfo = {};
      _.forEach(questions, (question) => {
        questionsInfo[question.id] = {};
        _.forEach(questionResponses[question.id], (questionResponse) => {
          if (question.type === 'singleResponse') {
          }
        });
      });

      console.log('questions', questions);
      return { generalInfo: feedbackGeneralInfo };
    },
    table.feedbackResponse,
    _transacting
  );
}

module.exports = getFeedbackResults;
