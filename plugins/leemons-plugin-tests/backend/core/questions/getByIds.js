/* eslint-disable no-param-reassign */
const _ = require('lodash');

const { QUESTION_TYPES } = require('../../config/constants');

/**
 * Represents a formatted text shape.
 *
 * @typedef {Object} formattedTextShape
 * @property {string} format - The format of the text.
 * @property {string} text - The text content.
 */

/**
 * Represents a choice for a mono-responsequestion.
 *
 * @typedef {Object} Choice
 * @property {formattedTextShape} text - The 'response' of the choice. Specifies format (html in Leemons).
 * @property {boolean} isCorrect - Indicates if the choice is correct.
 * @property {formattedTextShape} feedback - The feedback for the choice. Specifies format (html in Leemons).
 * @property {string} image - The image 'response' of the choice, only present in questions that use images as answers.
 * @property {string} imageDescription - The description of the image answer ,only present in questions that use images as answers.
 * @property {boolean} hideOnHelp - Indicates if the choice should be hidden on help.
 */

/**
 * Represents the properties for map questions.
 *
 * @typedef {Object} MapProperties
 * @property {string} image - The map image.
 * @property {string} caption - The caption for the map image.
 * @property {Markers} markers - The markers on the map.
 */

/**
 * Represents the markers on a map.
 *
 * @typedef {Object} Markers
 * @property {string} backgroundColor - The background color of the markers.
 * @property {string} type - The type of the markers: 'numerical' or 'letter' (alphabetical).
 * @property {Array<MapMarker>} list - The list of map markers.
 * @property {{left: string, top: string}} position - The position of the markers.
 */

/**
 * Represents a marker on a map.
 *
 * @typedef {Object} MapMarker
 * @property {string} response - The response associated with the marker.
 * @property {boolean} hideOnHelp - Indicates if the marker should be hidden on help.
 * @property {string} left - The left position of the marker.
 * @property {string} top - The top position of the marker.
 */

/**
 * Represents the data for a question.
 *
 * @typedef {Object} Question
 * @property {string} id - The unique identifier for the question.
 * @property {string} deploymentID - The deployment identifier for the question.
 * @property {string} questionBank - The question bank identifier the question belongs to.
 * @property {string} type - The type of the question.
 * @property {formattedTextShape} stem - The stem of the question. Specifies format (html in Leemons).
 * @property {boolean} hasEmbeddedAnswers - Indicates if the question has embedded answers.
 * @property {boolean} hasImageAnswers - Indicates if the question has image answers.
 * @property {string} level - The level of the question.
 * @property {formattedTextShape} globalFeedback - The global feedback for the question.
 * @property {boolean} hasAnswerFeedback - Indicates if the question has feedback per answer (be it one or many answers).
 * @property {Array<string>} clues - The text hints for the question.
 * @property {boolean} hasHelp - Indicates if the question has text hints or if it is configure to hide answer options.
 * @property {string} category - The category of the question.
 * @property {string} stemResource - A multimedia resource asset for the question stem.
 * @property {Array<Choice>} choices - The solution property for mono-response and multi-choice questions. Only present in multi-choice questions.
 * @property {Object} mapProperties - The solution property for map questions. Only present in map questions.
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
    if (question.type === QUESTION_TYPES.MONO_RESPONSE) {
      question.choices = question.choices || [];

      if (question.hasImageAnswers) {
        _.forEach(question.choices, (choice) => {
          assetIds.push(choice.image);
        });
      }
    }

    if (question.stemResource) {
      assetIds.push(question.stemResource);
    }

    if (question.mapProperties?.image) {
      assetIds.push(question.mapProperties.image);
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
    question.clues = question.clues || [];

    if (question.mapProperties?.image) {
      question.mapProperties.image = questionAssetsById[question.mapProperties.image];
    }
    if (question.stemResource) {
      question.stemResource = questionAssetsById[question.stemResource];
    }

    if (question.choices?.length) {
      _.forEach(question.choices, (choice) => {
        if (choice.image) {
          choice.image = questionAssetsById[choice.image];
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
