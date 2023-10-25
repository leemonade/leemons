/* eslint-disable no-param-reassign */
const _ = require('lodash');

async function getFeedbackQuestionByIds({ id, ctx }) {
  const questions = await ctx.tx.db.FeedbackQuestions.find({
    id: _.isArray(id) ? id : [id],
  }).lean();
  const assetIds = [];
  _.forEach(questions, (question) => {
    question.properties = JSON.parse(question.properties || null);
    if (question.properties.withImages && question.properties.responses?.length) {
      _.forEach(question.properties.responses, (response) => {
        assetIds.push(response.value.image);
      });
    }
  });

  const questionAssets = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: assetIds,
    withFiles: true,
  });

  const questionAssetsById = _.keyBy(questionAssets, 'id');
  _.forEach(questions, (question) => {
    if (question.properties.responses?.length) {
      _.forEach(question.properties.responses, (response) => {
        if (response.value.image) {
          response.value.image = questionAssetsById[response.value.image];
        }
      });
    }
  });

  return questions;
}

module.exports = getFeedbackQuestionByIds;
