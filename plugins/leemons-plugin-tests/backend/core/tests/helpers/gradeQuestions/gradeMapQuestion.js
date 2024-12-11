const { isNumber, forEach } = require('lodash');

const { QUESTION_RESPONSE_STATUS } = require('../../../../config/constants');
const { getQuestionTotalPoints } = require('../getQuestionTotalPoints');

function gradeMapQuestion({
  responseData,
  question,
  config,
  pointsPerQuestion,
  cluesConfigByType,
}) {
  const responses = responseData?.properties?.responses;
  let status;

  if (!responses) {
    status = QUESTION_RESPONSE_STATUS.OMITTED;
  } else {
    let allWithValues = true;
    let allValuesGood = true;

    forEach(question.mapProperties.markers.list, (r, index) => {
      if (!isNumber(responses[index])) {
        allWithValues = false;
      }
      if (responses[index] !== index) {
        allValuesGood = false;
      }
    });

    if (allWithValues && allValuesGood) {
      status = QUESTION_RESPONSE_STATUS.OK;
    } else if (allWithValues) {
      status = QUESTION_RESPONSE_STATUS.KO;
    } else {
      status = QUESTION_RESPONSE_STATUS.OMITTED;
    }
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

module.exports = { gradeMapQuestion };
