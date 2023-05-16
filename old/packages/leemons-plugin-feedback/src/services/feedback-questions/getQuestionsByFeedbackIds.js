const _ = require('lodash');

const { table } = require('../tables');
const getFeedbackQuestionByIds = require('./getFeedbackQuestionByIds');

async function getQuestionsByFeedbackIds(id, { userSession, transacting } = {}) {
  const questions = await table.feedbackQuestions.find(
    { assignable_$in: _.isArray(id) ? id : [id] },
    { transacting, columns: ['id'] }
  );

  return getFeedbackQuestionByIds(_.map(questions, 'id'), { userSession, transacting });
}

module.exports = getQuestionsByFeedbackIds;
