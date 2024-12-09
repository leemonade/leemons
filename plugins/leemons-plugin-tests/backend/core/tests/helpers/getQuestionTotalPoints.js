/* eslint-disable no-param-reassign */
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { forEach } = require('lodash');

const { QUESTION_RESPONSE_STATUS } = require('../../../config/constants');

const { getQuestionClues } = require('./getQuestionClues');

dayjs.extend(duration);

function getCluePenaltyPoints({
  question,
  questionResponse,
  config,
  pointsPerQuestion,
  cluesConfigByType,
}) {
  const usedClues = questionResponse.clues;
  const clues = getQuestionClues(question, 99999, config);
  let cluesPenaltyPoints = 0;
  forEach(clues, (clue, index) => {
    if (index < usedClues) {
      const lessPoints = pointsPerQuestion * (cluesConfigByType[clue.type].value / 100);
      cluesPenaltyPoints += lessPoints;
    }
  });
  return cluesPenaltyPoints;
}

function getPointsByStatus({ status, pointsPerQuestion, config }) {
  const perError = -(pointsPerQuestion * (config.wrong / 100));
  const perCorrect = pointsPerQuestion;
  const perOmission = -(pointsPerQuestion * (config.omit / 100));
  const partial = pointsPerQuestion / 2;

  if (status === QUESTION_RESPONSE_STATUS.OK) {
    return perCorrect;
  }
  if (status === QUESTION_RESPONSE_STATUS.KO) {
    return perError;
  }
  if (status === QUESTION_RESPONSE_STATUS.OMITTED) {
    return perOmission;
  }
  if (status === QUESTION_RESPONSE_STATUS.PARTIAL) {
    return partial;
  }
  return 0;
}

function getQuestionTotalPoints({
  question,
  questionResponse,
  config,
  pointsPerQuestion,
  cluesConfigByType,
  status,
}) {
  const points = getPointsByStatus({ status, pointsPerQuestion, config });

  if (status === QUESTION_RESPONSE_STATUS.OK) {
    const penalty = getCluePenaltyPoints({
      question,
      questionResponse,
      config,
      pointsPerQuestion,
      cluesConfigByType,
    });
    return points - penalty;
  }

  return points;
}

module.exports = { getQuestionTotalPoints, getPointsByStatus, getCluePenaltyPoints };
