const { isLRN } = require('@leemons/lrn');
const _ = require('lodash');

const { QUESTION_TYPES } = require('../../config/constants');

const { createStemResourceAsset } = require('./createStemResourceAsset');

const LIBRARY_ADD_ASSET = 'leebrary.assets.add';

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
 * @property {Array<MapMarker>} list - The list of markers.
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
 * Represents the properties for true-false questions.
 *
 * @typedef {Object} TrueFalseProperties
 * @property {boolean} isTrue - Indicates if the answer to the question is true.
 */

/**
 * Represents the data for a question.
 *
 * @typedef {Object} QuestionData
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
 * @property {string} stemResource - An asset id used as a multimedia resource for the question stem. Alternatively, a url to an external resource, (only for bulkdata compatibility).
 * @property {Array<Choice>} choices - The solution property for mono-response and multi-choice questions. Only present in multi-choice questions.
 * @property {Object} mapProperties - The solution property for map questions. Only present in map questions.
 * @property {Object} trueFalseProperties - The solution property for true-false questions. Only present in true-false questions.
 */

/**
 * Creates a question based on the provided data.
 *
 * @param {object} params - The parameters for the query.
 * @param {QuestionData} params.data - The data for the question.
 * @param {boolean} params.published - Indicates if the question should be published.
 * @param {MoleculerContext} params.ctx - The transaction context.
 * @returns {Promise<Object>} - The created question.
 */

async function createQuestion({ data, published, ctx }) {
  const { tags, choices, mapProperties, trueFalseProperties, openResponseProperties, ...props } =
    _.cloneDeep(data);

  // For map questions, create the map image asset
  if (props.type === QUESTION_TYPES.MAP) {
    const asset = await ctx.tx.call(LIBRARY_ADD_ASSET, {
      asset: {
        name: `Map question image`,
        cover: mapProperties.image?.cover?.id ?? mapProperties.image,
        indexable: false,
        public: true,
      },
      options: { published },
    });
    mapProperties.image = asset.id;
  }

  // Form mono-response questions that use images as answers, create the respective assets
  if (props.type === QUESTION_TYPES.MONO_RESPONSE && props.hasImageAnswers) {
    const promises = [];
    _.forEach(choices, (choice, index) => {
      promises.push(
        ctx.tx.call(LIBRARY_ADD_ASSET, {
          asset: {
            name: `Question Image Response ${index}`,
            cover: choice.image?.cover?.id ?? choice.image,
            description: choice.imageDescription,
            indexable: false,
            public: true,
          },
          options: { published },
        })
      );
    });
    const assets = await Promise.all(promises);
    _.forEach(choices, (choice, index) => {
      // eslint-disable-next-line no-param-reassign
      choice.image = assets[index].id;
    });
  }

  if (props.stemResource) {
    let sourceAsset = props.stemResource;
    if (typeof props.stemResource === 'string' && isLRN(props.stemResource)) {
      [sourceAsset] = await ctx.tx.call('leebrary.assets.getByIds', {
        ids: [props.stemResource],
        withFiles: true,
      });
    }

    props.stemResource = await createStemResourceAsset({ ctx, sourceAsset, published });
  }

  const questionToCreate = { ...props };

  // Add answer properties according to the question type
  if (props.type === QUESTION_TYPES.MAP) {
    questionToCreate.mapProperties = mapProperties;
  } else if (
    props.type === QUESTION_TYPES.MONO_RESPONSE ||
    props.type === QUESTION_TYPES.SHORT_RESPONSE
  ) {
    questionToCreate.choices = choices;
  } else if (props.type === QUESTION_TYPES.TRUE_FALSE) {
    questionToCreate.trueFalseProperties = trueFalseProperties;
  } else if (props.type === QUESTION_TYPES.OPEN_RESPONSE) {
    questionToCreate.openResponseProperties = openResponseProperties;
  }

  let question = await ctx.tx.db.Questions.create(questionToCreate);
  question = question.toObject();

  await ctx.tx.call('common.tags.setTagsToValues', {
    type: 'tests.questions',
    tags: tags || [],
    values: question.id,
  });

  return question;
}

module.exports = { createQuestion };
