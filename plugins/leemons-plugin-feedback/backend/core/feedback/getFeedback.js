/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { getFeedbackQuestionByIds } = require('../feedback-questions');

async function getFeedback(id, { userSession, transacting } = {}, getAssets = true) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  const assetService = leemons.getPlugin('leebrary').services.assets;

  // Check is userSession is provided
  if (getAssets && !userSession)
    throw new Error('User session is required (getQuestionsBanksDetails)');

  const ids = _.isArray(id) ? id : [id];

  const assignables = await assignableService.getAssignables(ids, {
    withFiles: true,
    userSession,
    transacting,
  });

  const imagesIds = [];
  _.forEach(assignables, (assignable) => {
    if (assignable.metadata.featuredImage) imagesIds.push(assignable.metadata.featuredImage);
  });

  const questionAssets = await assetService.getByIds(imagesIds, {
    withFiles: true,
    userSession,
    transacting,
  });

  const questionAssetsById = _.keyBy(questionAssets, 'id');

  const assignableIds = _.map(assignables, 'id');
  const questionIds = await table.feedbackQuestions.find(
    { assignable_$in: assignableIds },
    {
      columns: ['id'],
      transacting,
    }
  );

  const questions = await getFeedbackQuestionByIds(_.map(questionIds, 'id'), {
    userSession,
    transacting,
  });

  const questionsByFeedback = _.groupBy(questions, 'assignable');
  const result = _.map(assignables, (feedback) => {
    const toReturn = {
      id: feedback.id,
      asset: feedback.asset,
      name: feedback.asset.name,
      file: feedback.asset.file,
      tags: feedback.asset.tags,
      color: feedback.asset.color,
      cover: feedback.asset.cover,
      tagline: feedback.asset.tagline,
      featuredImage: questionAssetsById[feedback.metadata.featuredImage],
      description: feedback.asset.description,
      introductoryText: feedback.statement,
      thanksMessage: feedback.metadata.thanksMessage,
      questions: _.map(questionsByFeedback[feedback.id] || [], (question) => ({
        ...question,
        required: !!question.required,
      })),
    };
    toReturn.questions = _.orderBy(toReturn.questions, ['order'], ['asc']);
    return toReturn;
  });
  return _.isArray(id) ? result : result[0];
}

module.exports = getFeedback;
