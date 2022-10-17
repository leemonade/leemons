/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const getQuestionsByFeedbackIds = require('../feedback-questions/getQuestionsByFeedbackIds');

async function duplicateFeedback(id, { published, userSession, transacting: _transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  const { assets: assetsService } = leemons.getPlugin('leebrary').services;
  return global.utils.withTransaction(
    async (transacting) => {
      const newAssignable = await assignableService.duplicateAssignable(id, {
        published,
        userSession,
        transacting,
      });
      const questions = await getQuestionsByFeedbackIds(id);

      const assetIds = [];
      _.forEach(questions, (question) => {
        if (
          (question.type === 'singleResponse' || question.type === 'multiResponse') &&
          question.properties.withImages
        ) {
          _.forEach(question.properties.responses, ({ value }) => {
            assetIds.push(value.image.id);
          });
        }
      });

      const promises = [];
      _.forEach(assetIds, (assetId) => {
        promises.push(
          assetsService.duplicate(assetId, {
            preserveName: true,
            userSession,
            transacting,
          })
        );
      });
      const assets = await Promise.all(promises);

      const newQuestions = _.map(questions, (question) => {
        delete question.id;
        question.assignable = newAssignable.id;
        if (
          (question.type === 'singleResponse' || question.type === 'multiResponse') &&
          question.properties.withImages
        ) {
          _.forEach(question.properties.responses, ({ value }, index) => {
            value.image = assets[index].id;
          });
        }
        question.properties = JSON.stringify(question.properties);
        return question;
      });

      await table.feedbackQuestions.createMany(newQuestions, { transacting });

      if (newAssignable.metadata.featuredImage) {
        const newFeaturedImage = await assetsService.duplicate(
          newAssignable.metadata.featuredImage,
          {
            preserveName: true,
            userSession,
            transacting,
          }
        );
        newAssignable.metadata.featuredImage = newFeaturedImage.id;
        await assignableService.updateAssignable(newAssignable, {
          userSession,
          transacting,
          published,
        });
      }

      return true;
    },
    table.feedbackQuestions,
    _transacting
  );
}

module.exports = duplicateFeedback;
