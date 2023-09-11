/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { deleteFeedbackQuestions } = require('../feedback-questions/deleteFeedbackQuestions');

async function deleteFeedback({ id, ctx }) {
  const { versions } = await ctx.tx.call('assignables.assignables.removeAssignable', {
    assignable: id,
    removeAll: 1,
  });

  const questions = await ctx.tx.db.FeedbackQuestions.find({
    assignable: versions,
  })
    .select(['id'])
    .lean();

  await deleteFeedbackQuestions({ questionId: _.map(questions, 'id'), ctx });

  return true;
}

module.exports = deleteFeedback;
