/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function getByIds(id, { options, userSession, transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const assetService = leemons.getPlugin('leebrary').services.assets;
  const questions = await table.questions.find(
    { id_$in: _.isArray(id) ? id : [id] },
    { transacting }
  );
  const assetIds = [];
  _.forEach(questions, (question) => {
    question.properties = JSON.parse(question.properties);
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
    assetService.getByIds(assetIds, {
      withFiles: true,
      userSession,
      transacting,
    }),
    tagsService.getValuesTags(_.map(questions, 'id'), {
      type: 'plugins.tests.questions',
      transacting,
    }),
  ]);

  const questionAssetsById = _.keyBy(questionAssets, 'id');
  _.forEach(questions, (question, i) => {
    question.tags = questionsTags[i];
    question.clues = JSON.parse(question.clues);
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
    const categories = await table.questionBankCategories.find(
      { id_$in: categoryIds },
      { transacting }
    );
    const categoriesById = _.keyBy(categories, 'id');
    _.forEach(questions, (question) => {
      question.category = categoriesById[question.category];
    });
  }

  return questions;
}

module.exports = { getByIds };
