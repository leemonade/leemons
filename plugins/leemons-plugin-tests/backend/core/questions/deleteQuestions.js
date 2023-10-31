const _ = require('lodash');

async function deleteQuestions({ questionId, ctx }) {
  const questionIds = _.isArray(questionId) ? questionId : [questionId];
  const questions = await ctx.tx.db.Questions.find({ id: questionIds }).lean();

  const assetIds = [];
  _.forEach(questions, (question) => {
    // eslint-disable-next-line no-param-reassign
    question.properties = JSON.parse(question.properties || null);
    if (question.properties?.image) {
      assetIds.push(question.properties.image);
    }
  });

  // TODO: Añadir borrado de assets
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
