const { QUESTION_RESPONSE_STATUS } = require('../../../../config/constants');
const { getQuestionTotalPoints } = require('../getQuestionTotalPoints');

function shortResponseIsCorrect(userResponse, question, config = {}) {
  const hasActiveTolerances = config.questionFilters?.shortResponse?.activateTolerances;

  if (!hasActiveTolerances) {
    return question.choices.map((choice) => choice.text.text).includes(userResponse);
  }

  let userResponseProcessed = userResponse;
  const { tolerateAccents, tolerateSpaces, tolerateCase } = config.questionFilters.shortResponse;

  const processedChoices = question.choices.map((choice) => {
    let processedChoice = choice.text.text;

    if (tolerateSpaces) {
      processedChoice = processedChoice.replace(/\s/g, '');
      userResponseProcessed = userResponseProcessed.replace(/\s/g, '');
    }
    if (tolerateCase) {
      processedChoice = processedChoice.toLowerCase();
      userResponseProcessed = userResponseProcessed.toLowerCase();
    }
    if (tolerateAccents) {
      processedChoice = processedChoice.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      userResponseProcessed = userResponseProcessed
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    return processedChoice;
  });

  return processedChoices.includes(userResponseProcessed);
}

function gradeShortResponseQuestion({
  responseData,
  question,
  config,
  pointsPerQuestion,
  cluesConfigByType,
}) {
  const response = responseData?.properties?.response;

  let status;
  if (!response?.length) {
    status = QUESTION_RESPONSE_STATUS.OMITTED;
  } else if (shortResponseIsCorrect(response, question, config)) {
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

module.exports = { gradeShortResponseQuestion };
