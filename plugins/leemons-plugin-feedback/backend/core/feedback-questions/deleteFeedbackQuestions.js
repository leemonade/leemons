const _ = require('lodash');
const { forEach, isString } = require('lodash');

async function deleteFeedbackQuestions({ questionId, ctx }) {
  const questionIds = _.isArray(questionId) ? questionId : [questionId];
  const questions = await ctx.tx.db.FeedbackQuestions.find({ id: questionIds }).lean();

  const assetIds = [];
  _.forEach(questions, (question) => {
    // eslint-disable-next-line no-param-reassign
    question.properties = JSON.parse(question.properties || null);
    if (question.properties.responses) {
      forEach(question.properties.responses, (response) => {
        if (response.value.image && !isString(response.value.image)) {
          assetIds.push(response.value.image);
        }
      });
    }
  });

  if (assetIds.length) {
    await Promise.all(_.map(assetIds, (r) => ctx.tx.call('leebrary.assets.remove', { id: r })));
  }
  await ctx.tx.db.FeedbackQuestions.deleteMany({ id: questionIds });

  return true;
}

module.exports = { deleteFeedbackQuestions };
