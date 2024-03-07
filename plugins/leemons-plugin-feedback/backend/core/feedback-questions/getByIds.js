/* eslint-disable no-param-reassign */
const _ = require('lodash');

async function getByIds({ id, options, ctx }) {
  const questions = await ctx.tx.db.Questions.find({ id: _.isArray(id) ? id : [id] }).lean();
  const assetIds = [];
  _.forEach(questions, (question) => {
    question.properties = JSON.parse(question.properties || null);
    if (question.questionImage) {
      assetIds.push(question.questionImage);
    }
    if (question.properties?.image) {
      assetIds.push(question.properties.image);
    }
    if (question.withImages && question.type === 'mono-response') {
      _.forEach(question.properties.responses, (response) => {
        assetIds.push(response.value.image);
      });
    }
  });

  const [questionAssets, questionsTags] = await Promise.all([
    ctx.tx.call('leebrary.assets.getByIds', {
      ids: assetIds,
      withFiles: true,
    }),
    ctx.tx.call('common.tags.getValuesTags', {
      tags: _.map(questions, 'id'),
      type: 'tests.questions',
    }),
  ]);

  const questionAssetsById = _.keyBy(questionAssets, 'id');
  _.forEach(questions, (question, i) => {
    question.tags = questionsTags[i];
    question.clues = JSON.parse(question.clues || null);
    if (question.properties?.image) {
      question.properties.image = questionAssetsById[question.properties.image];
    }
    if (question.questionImage) {
      question.questionImage = questionAssetsById[question.questionImage];
      if (question.questionImage)
        question.questionImageDescription = question.questionImage.description;
    }
    if (question.properties.responses) {
      _.forEach(question.properties.responses, (response) => {
        if (response.value.image) {
          response.value.image = questionAssetsById[response.value.image];
        }
      });
    }
  });

  if (options?.categories) {
    const categoryIds = _.map(questions, 'category');
    const categories = await ctx.tx.db.QuestionBankCategories.find({ id: categoryIds }).lean();
    const categoriesById = _.keyBy(categories, 'id');
    _.forEach(questions, (question) => {
      question.category = categoriesById[question.category];
    });
  }

  return questions;
}

module.exports = { getByIds };
