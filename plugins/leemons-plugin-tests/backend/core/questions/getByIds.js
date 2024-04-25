/* eslint-disable no-param-reassign */
const _ = require('lodash');

/**
 * @typedef {Object} QuestionAsset
 * @property {string} id - The unique identifier of the asset.
 * @property {string} [description] - The description of the asset, if any.
 * @property {Object} [file] - The file details of the asset, if `withFiles` is true.
 */

/**
 * @typedef {Object} QuestionResponse
 * @property {Object} value - The response value.
 * @property {QuestionAsset} [value.image] - The image asset associated with the response, if any.
 */

/**
 * @typedef {Object} QuestionProperties
 * @property {string} [image] - The unique identifier of the question image asset, if any.
 * @property {QuestionResponse[]} [responses] - The responses associated with the question, if any.
 */

/**
 * @typedef {Object} Question
 * @property {string} id - The unique identifier of the question.
 * @property {string} deploymentID - The deployment ID associated with the question.
 * @property {string} [questionBank] - The question bank ID, if any.
 * @property {string} type - The type of the question.
 * @property {boolean} withImages - Indicates if the question includes images.
 * @property {string} level - The difficulty level of the question.
 * @property {string} question - The question text.
 * @property {QuestionAsset} [questionImage] - The question image asset, if any.
 * @property {string[]} clues - The clues associated with the question.
 * @property {string} [category] - The category ID of the question, if any.
 * @property {QuestionProperties} properties - The additional configuration of the question according to its type.
 * @property {Object[]} tags - The tags associated with the question.
 * @property {string} [questionImageDescription] - The description of the question image, if any.
 */

/**
 * Retrieves questions by their IDs.
 *
 * @param {object} params - The parameters for the query.
 * @param {string|string[]} params.id - The ID(s) of the question(s) to retrieve.
 * @param {object} params.options - The options for the query.
 * @param {MoleculerContext} params.ctx - The transaction context.
 * @returns {Promise<Question[]>} - The retrieved questions.
 */
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
      type: 'tests.questions',
      values: _.map(questions, 'id'),
    }),
  ]);

  const questionAssetsById = _.keyBy(questionAssets, 'id');
  _.forEach(questions, (question, i) => {
    question.tags = questionsTags[i];
    // question.clues = JSON.parse(question.clues);
    question.clues = JSON.parse(question.clues || '[]');
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
