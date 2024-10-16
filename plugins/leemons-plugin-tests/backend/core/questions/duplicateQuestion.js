const _ = require('lodash');
const { getByIds: getQuestionById } = require('./getByIds');
const { createQuestion } = require('./createQuestion');
const { QUESTION_TYPES } = require('../../config/constants');

function prepareQuestionForDuplication({ id, mapProperties, choices, questionImage, ...question }) {
  const transformedQuestion = {
    ...question,
  };

  if (question.type === QUESTION_TYPES.MAP) {
    transformedQuestion.mapProperties = _.cloneDeep(mapProperties);
    transformedQuestion.mapProperties.image = mapProperties?.cover?.id;
  }

  if (question.type === QUESTION_TYPES.MONO_RESPONSE) {
    transformedQuestion.choices = _.cloneDeep(choices);
    transformedQuestion.choices.forEach((choice, index) => {
      if (choice.image) {
        transformedQuestion.choices[index].image = choice.image.id;
      }
    });
  }

  if (questionImage) {
    transformedQuestion.questionImage = questionImage.cover.id;
  }

  return transformedQuestion;
}

async function duplicateQuestion({ id, ctx }) {
  const question = await getQuestionById({ id, ctx });
  const transformedQuestion = prepareQuestionForDuplication(question);

  return createQuestion({ data: transformedQuestion, published: true, ctx });
}

module.exports = { duplicateQuestion, prepareQuestionForDuplication };
