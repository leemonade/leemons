const { QUESTION_RESPONSE_STATUS } = require('../../../../config/constants');
const { getQuestionTotalPoints } = require('../getQuestionTotalPoints');

function gradeTrueFalseQuestion({
  responseData,
  question,
  config,
  pointsPerQuestion,
  cluesConfigByType,
}) {
  const response = responseData?.properties?.response;
  const questionIsTrue = question.trueFalseProperties.isTrue;

  let status;
  if (typeof response !== 'boolean') {
    status = QUESTION_RESPONSE_STATUS.OMITTED;
  } else if (response === questionIsTrue) {
    status = QUESTION_RESPONSE_STATUS.OK;
  } else {
    status = QUESTION_RESPONSE_STATUS.KO;
  }

  const points = getQuestionTotalPoints({
    status,
    question,
    questionResponse: responseData,
    config,
    pointsPerQuestion,
    cluesConfigByType,
  });
  return { points, status };
}

module.exports = { gradeTrueFalseQuestion };
