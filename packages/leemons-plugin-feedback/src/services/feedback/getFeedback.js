/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { getFeedbackQuestionByIds } = require('../feedback-questions');

async function getFeedback(id, { userSession, transacting } = {}, getAssets = true) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;

  // Check is userSession is provided
  if (getAssets && !userSession)
    throw new Error('User session is required (getQuestionsBanksDetails)');

  const ids = _.isArray(id) ? id : [id];

  const assignables = await Promise.all(
    _.map(ids, (_id) =>
      assignableService.getAssignable(_id, {
        userSession,
        withFiles: true,
        transacting,
      })
    )
  );

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
  const result = _.map(assignables, (feedback) => ({
    id: feedback.id,
    asset: feedback.asset,
    name: feedback.asset.name,
    file: feedback.asset.file,
    tags: feedback.asset.tags,
    color: feedback.asset.color,
    cover: feedback.asset.cover,
    tagline: feedback.asset.tagline,
    description: feedback.asset.description,
    introductoryText: feedback.statement,
    questions: _.map(questionsByFeedback[feedback.id] || [], (question) => ({
      ...question,
    })),
  }));
  return _.isArray(id) ? result : result[0];
}

module.exports = getFeedback;
