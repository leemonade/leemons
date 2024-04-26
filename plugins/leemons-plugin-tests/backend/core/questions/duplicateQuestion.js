const _ = require('lodash');
const { getByIds: getQuestionById } = require('./getByIds');
const { createQuestion } = require('./createQuestion');

async function duplicateQuestion({ id, ctx }) {
  const question = await getQuestionById({ id, ctx });
  const toSave = _.omit(question, ['id']);

  const transformedData = {
    type: toSave.type,
    tags: toSave.tags,
    clues: toSave.clues,
    properties: {
      image: toSave.properties?.image?.id,
      responses: toSave.properties?.responses?.map((response) => ({
        value: {
          image: response.value.image?.id,
          imageDescription: response.value.image?.description,
        },
      })),
      questionImage: toSave.questionImage?.id,
      questionImageDescription: toSave.questionImageDescription,
    },
  };

  return createQuestion({ data: transformedData, published: true, ctx });
}

module.exports = { duplicateQuestion };
