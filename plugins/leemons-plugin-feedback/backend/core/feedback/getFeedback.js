/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getFeedbackQuestionByIds } = require('../feedback-questions');

async function getFeedback({ id, getAssets = true, ctx }) {
  const { userSession } = ctx.meta;

  // Check is userSession is provided
  if (getAssets && !userSession)
    throw new LeemonsError(ctx, { message: 'User session is required (getQuestionsBanksDetails)' });

  const ids = _.isArray(id) ? id : [id];

  const assignables = await ctx.tx.call('assignables.assignables.getAssignables', {
    ids,
    withFiles: true,
  });

  const imagesIds = [];
  _.forEach(assignables, (assignable) => {
    if (assignable.metadata.featuredImage) imagesIds.push(assignable.metadata.featuredImage);
  });

  const questionAssets = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: imagesIds,
    withFiles: true,
  });

  const questionAssetsById = _.keyBy(questionAssets, 'id');

  const assignableIds = _.map(assignables, 'id');
  const questionIds = await ctx.tx.db.FeedbackQuestions.find({ assignable: assignableIds })
    .select(['id'])
    .lean();

  const questions = await getFeedbackQuestionByIds({ id: _.map(questionIds, 'id'), ctx });

  const questionsByFeedback = _.groupBy(questions, 'assignable');
  const result = _.map(assignables, (feedback) => {
    const toReturn = {
      id: feedback.id,
      asset: feedback.asset,
      roleDetails: feedback.roleDetails,
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
