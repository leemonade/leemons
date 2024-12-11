const { findIndex, isNumber } = require('lodash');

const { QUESTION_RESPONSE_STATUS } = require('../../../../config/constants');
const { getQuestionTotalPoints } = require('../getQuestionTotalPoints');

function gradeMonoResponseQuestion({
  responseData,
  question,
  config,
  pointsPerQuestion,
  cluesConfigByType,
}) {
  const response = responseData?.properties?.response;
  const correctIndex = findIndex(question.choices, {
    isCorrect: true,
  });

  let status;
  if (!isNumber(response)) {
    status = QUESTION_RESPONSE_STATUS.OMITTED;
  } else if (response === correctIndex) {
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

module.exports = { gradeMonoResponseQuestion };
