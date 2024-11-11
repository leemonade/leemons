const _ = require('lodash');

const { QUESTION_TYPES } = require('../../config/constants');

/**
 * Manages the solution fields for a question based on its type.
 *
 * This function updates or removes solution fields based on whether the question type has changed.
 * It handles the specific requirements for MAP and MONO_RESPONSE question types.
 *
 * @param {Object} params - The parameters for the solution field management.
 * @param {Object} params.mapProperties - The map properties for MAP questions.
 * @param {Array} params.choices - The choices for MONO_RESPONSE questions.
 * @param {string} params.type - The type of the question.
 * @param {boolean} params.typeHasChanged - Whether the question type has changed.
 * @returns {Object} - An object containing the solution management fields.
 */

function manageSolutionFields({ mapProperties, choices, type, typeHasChanged }) {
  const solutionManagementFields = {};

  if (type === QUESTION_TYPES.MAP) {
    solutionManagementFields.mapProperties = mapProperties;
    if (typeHasChanged) solutionManagementFields.$unset = { choices: 1 };
  } else if (type === QUESTION_TYPES.MONO_RESPONSE || type === QUESTION_TYPES.SHORT_RESPONSE) {
    solutionManagementFields.choices = choices;
    if (typeHasChanged) solutionManagementFields.$unset = { mapProperties: 1 };
  }

  return solutionManagementFields;
}

// All images could be an asset object or an asset id
async function updateQuestion({ data, published, ctx }) {
  const { id, tags, mapProperties, choices, ...props } = data;
  const question = await ctx.tx.db.Questions.findOne({ id }).lean();

  // If it's a map question, we check if its image asset already exists. If it does we update it, else we create it.
  if (data.type === QUESTION_TYPES.MAP) {
    const mapImageFile = mapProperties.image?.cover?.id ?? mapProperties.image;
    if (question.mapProperties?.image) {
      const asset = await ctx.tx.call('leebrary.assets.update', {
        data: {
          id: question.mapProperties.image,
          name: `Map question image`,
          cover: mapImageFile,
        },
        published,
      });
      mapProperties.image = asset.id;
    } else {
      const asset = await ctx.tx.call('leebrary.assets.add', {
        asset: {
          name: `Map question image`,
          cover: mapImageFile,
          indexable: false,
          public: true,
        },
        options: { published },
      });
      mapProperties.image = asset.id;
    }
  }

  // --- Question image
  const questionImage = data.questionImage?.cover?.id ?? data.questionImage;
  if (question.questionImage) {
    const asset = await ctx.tx.call('leebrary.assets.update', {
      data: {
        id: question.questionImage,
        name: 'Question image',
        cover: questionImage,
      },
      published,
    });

    props.questionImage = asset.id;
  } else if (!question.questionImage && questionImage) {
    const asset = await ctx.tx.call('leebrary.assets.add', {
      asset: {
        name: `Image question - ${question.id}`,
        cover: questionImage,
        indexable: false,
        public: true,
      },
      options: { published },
    });
    props.questionImage = asset.id;
  }

  if (data.type === QUESTION_TYPES.MONO_RESPONSE) {
    const toRemove = [];
    _.forEach(question.choices, (choice) => {
      if (choice.image) {
        toRemove.push(choice.image);
      }
    });

    if (data.hasImageAnswers) {
      const promises = [];
      _.forEach(choices, (choice, index) => {
        const choiceImage = choice.image?.cover?.id ?? choice.image;
        promises.push(
          ctx.tx.call('leebrary.assets.add', {
            asset: {
              name: `Question Image Response ${index}`,
              cover: choiceImage,
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

    if (toRemove.length) {
      await Promise.all(_.map(toRemove, (r) => ctx.tx.call('leebrary.assets.remove', { id: r })));
    }
  }

  const solutionFields = manageSolutionFields({
    mapProperties,
    choices,
    type: data.type,
    typeHasChanged: question.type !== data.type,
  });
  const updateObject = {
    ...props,
    ...solutionFields,
  };

  const [updatedQuestion] = await Promise.all([
    ctx.tx.db.Questions.findOneAndUpdate({ id }, updateObject, { new: true, lean: true }),
    ctx.tx.call('common.tags.setTagsToValues', {
      type: 'tests.questions',
      tags: tags || [],
      values: id,
    }),
  ]);

  return updatedQuestion;
}

module.exports = { updateQuestion };
