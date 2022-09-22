/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function getFeedbackQuestionByIds(id, { userSession, transacting } = {}) {
  const assetService = leemons.getPlugin('leebrary').services.assets;
  const questions = await table.feedbackQuestions.find(
    { id_$in: _.isArray(id) ? id : [id] },
    { transacting }
  );
  const assetIds = [];
  _.forEach(questions, (question) => {
    question.properties = JSON.parse(question.properties);
    if (question.properties.withImages && question.properties.responses?.length) {
      _.forEach(question.properties.responses, (response) => {
        assetIds.push(response.value.image);
      });
    }
  });

  const questionAssets = await assetService.getByIds(assetIds, {
    withFiles: true,
    userSession,
    transacting,
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
