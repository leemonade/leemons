const { QUESTION_RESPONSE_STATUS } = require('../../../../config/constants');
const { getQuestionTotalPoints } = require('../getQuestionTotalPoints');

function gradeOpenQuestion({
  responseData,
  question,
  config,
  pointsPerQuestion,
  cluesConfigByType,
}) {
  const response = responseData?.properties?.response;
  const status = !response
    ? QUESTION_RESPONSE_STATUS.OMITTED
    : responseData.status || QUESTION_RESPONSE_STATUS.NOT_GRADED;

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

module.exports = { gradeOpenQuestion };
