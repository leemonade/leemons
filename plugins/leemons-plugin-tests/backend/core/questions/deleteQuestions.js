const _ = require('lodash');

async function deleteQuestions({ questionId, ctx }) {
  const questionIds = _.isArray(questionId) ? questionId : [questionId];

  // TODO: Delete question image assetes (map, answers with image, question featured image)

  await Promise.all([
    ctx.tx.db.Questions.deleteMany({ id: questionIds }),
    ctx.tx.call('common.tags.removeAllTagsForValues', {
      type: 'tests.questionBanks',
      values: questionIds,
    }),
  ]);

  return true;
}

module.exports = { deleteQuestions };
