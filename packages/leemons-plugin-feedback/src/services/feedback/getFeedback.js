/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { getFeedbackQuestionByIds } = require('../feedback-questions');

async function getFeedback(id, { userSession, transacting } = {}, getAssets = true) {
  // Check is userSession is provided
  if (getAssets && !userSession)
    throw new Error('User session is required (getQuestionsBanksDetails)');

  const tagsService = leemons.getPlugin('common').services.tags;
  const ids = _.isArray(id) ? id : [id];
  const feedbacks = await table.feedback.find(
    { $or: [{ id_$in: ids }, { asset_$in: ids }], deleted_$null: false },
    { transacting }
  );

  const feedbackIds = _.map(feedbacks, 'id');
  const questionIds = await table.feedbackQuestions.find(
    { feedback_$in: feedbackIds },
    {
      columns: ['id'],
      transacting,
    }
  );
  const questions = await getFeedbackQuestionByIds(_.map(questionIds, 'id'), {
    userSession,
    transacting,
  });

  const promises = [];
  if (feedbacks.length) {
    promises.push(
      tagsService.getValuesTags(_.map(feedbacks, 'id'), {
        type: 'plugins.feedback.feedback',
        transacting,
      })
    );
    if (getAssets) {
      const assetService = leemons.getPlugin('leebrary').services.assets;
      promises.push(
        assetService.getByIds(_.map(feedbacks, 'asset'), {
          withFiles: true,
          userSession,
          transacting,
        })
      );
    } else {
      promises.push(Promise.resolve([]));
    }
  } else {
    promises.push(Promise.resolve([]));
    promises.push(Promise.resolve([]));
  }

  const [feedbacksTags, feedbacksAssets] = await Promise.all(promises);

  _.forEach(feedbacks, (feedback, i) => {
    feedback.tags = feedbacksTags[i];
    if (feedbacksAssets[i]) {
      feedback.asset = feedbacksAssets[i];
      feedback.tagline = feedbacksAssets[i].tagline;
      feedback.description = feedbacksAssets[i].description;
      feedback.color = feedbacksAssets[i].color;
      feedback.file = feedbacksAssets[i].file;
      feedback.tags = feedbacksAssets[i].tags;
      feedback.cover = feedbacksAssets[i].cover;
    }
  });

  const questionsByFeedback = _.groupBy(questions, 'feedback');
  const result = _.map(feedbacks, (feedback) => ({
    ...feedback,
    questions: _.map(questionsByFeedback[feedback.id] || [], (question) => ({
      ...question,
    })),
  }));
  return _.isArray(id) ? result : result[0];
}

module.exports = getFeedback;
