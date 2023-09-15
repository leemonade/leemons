const _ = require('lodash');

const getFeedbackQuestionByIds = require('./getFeedbackQuestionByIds');

async function getQuestionsByFeedbackIds({ id, ctx }) {
  const questions = await ctx.tx.db.FeedbackQuestions.find({
    assignable: _.isArray(id) ? id : [id],
  })
    .select(['id'])
    .lean();

  return getFeedbackQuestionByIds({ id: _.map(questions, 'id'), ctx });
}

module.exports = getQuestionsByFeedbackIds;
