/* eslint-disable no-param-reassign */
const _ = require('lodash');

const getQuestionsByFeedbackIds = require('../feedback-questions/getQuestionsByFeedbackIds');

async function duplicateFeedback({ id, published, ctx }) {
  const newAssignable = await ctx.tx.call('assignables.assignables.duplicateAssignable', {
    assignableId: id,
    published: false, // forced to false to avoid the creation of different versions of the assignable when updating later in this function
  });

  const questions = await getQuestionsByFeedbackIds({ id, ctx });

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
      ctx.tx.call('leebrary.assets.duplicate', {
        assetId,
        preserveName: true,
      })
    );
  });
  const assets = await Promise.all(promises);

  const newQuestions = _.map(questions, (question) => {
    delete question.id;
    delete question._id;
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

  await ctx.tx.db.FeedbackQuestions.insertMany(newQuestions);

  if (newAssignable.metadata.featuredImage) {
    const newFeaturedImage = await ctx.tx.call('leebrary.assets.duplicate', {
      assetId: newAssignable.metadata.featuredImage,
      preserveName: true,
    });
    newAssignable.metadata.featuredImage = newFeaturedImage.id;
    await ctx.tx.call('assignables.assignables.updateAssignable', {
      assignable: newAssignable,
      published,
    });
  }

  return true;
}

module.exports = duplicateFeedback;
