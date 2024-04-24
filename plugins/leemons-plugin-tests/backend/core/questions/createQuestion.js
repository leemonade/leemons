const _ = require('lodash');

/**
 * @typedef {Object} QuestionData
 * @property {string} type - The type of the question (e.g., 'map', 'mono-response').
 * @property {boolean} [published] - Indicates if the question should be published.
 * @property {Object[]} [tags] - Tags associated with the question.
 * @property {Object[]} [clues] - Clues associated with the question.
 * @property {Object} properties - Properties specific to the question type.
 * @property {string} [properties.image] - Image URL for 'map' type questions.
 * @property {Object[]} [properties.responses] - Responses for 'mono-response' type questions.
 * @property {string} [properties.responses[].value.image] - Image URL for each response.
 * @property {string} [properties.responses[].value.imageDescription] - Description of the image for each response.
 * @property {string} [questionImage] - Image URL for the question.
 * @property {string} [questionImageDescription] - Description of the question image.
 */

const LIBRARY_ADD_ASSET = 'leebrary.assets.add';

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
  const { tags, clues, properties, ...props } = data;
  // ES: Si el tipo es map creamos el asset
  if (data.type === 'map') {
    const asset = await ctx.tx.call(LIBRARY_ADD_ASSET, {
      asset: {
        name: `Image question`,
        cover:
          data.properties.image?.cover?.id ?? data.properties.image?.cover ?? data.properties.image,
        indexable: false,
        public: true, // TODO Cambiar a false despues de hacer la demo
      },
      options: { published },
    });
    properties.image = asset.id;
  }

  if (data.type === 'mono-response' && data.withImages) {
    const promises = [];
    _.forEach(properties.responses, (response, index) => {
      promises.push(
        ctx.tx.call(LIBRARY_ADD_ASSET, {
          asset: {
            name: `Image question Response ${index}`,
            cover:
              response.value.image?.cover?.id ??
              response.value.image?.cover ??
              response.value.image,
            description: response.value.imageDescription,
            indexable: false,
            public: true, // TODO Cambiar a false despues de hacer la demo
          },
          options: { published },
        })
      );
    });
    const assets = await Promise.all(promises);
    _.forEach(properties.responses, (response, index) => {
      response.value.image = assets[index].id;
    });
  }

  if (props.questionImage) {
    const asset = await ctx.tx.call(LIBRARY_ADD_ASSET, {
      asset: {
        name: `Image question`,
        cover: data.questionImage?.cover?.id ?? data.questionImage?.cover ?? data.questionImage,
        description: data.questionImageDescription,
        indexable: false,
        public: true, // TODO Cambiar a false despues de hacer la demo
      },
      options: { published },
    });

    props.questionImage = asset.id;
  }

  let question = await ctx.tx.db.Questions.create({
    ...props,
    clues: JSON.stringify(clues),
    properties: JSON.stringify(properties),
  });
  question = question.toObject();

  await ctx.tx.call('common.tags.setTagsToValues', {
    type: 'tests.questions',
    tags: tags || [],
    values: question.id,
  });

  return question;
}

module.exports = { createQuestion };
