/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function getByIds(id, { userSession, transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const assetService = leemons.getPlugin('leebrary').services.assets;
  const questions = await table.questions.find(
    { id_$in: _.isArray(id) ? id : [id] },
    { transacting }
  );
  const assetIds = [];
  _.forEach(questions, (question) => {
    question.properties = JSON.parse(question.properties);
    if (question.properties?.image) {
      assetIds.push(question.properties.image);
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
    if (question.properties?.image) {
      question.properties.image = questionAssetsById[question.properties.image];
    }
  });

  return questions;
}

module.exports = { getByIds };
