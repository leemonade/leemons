/* eslint-disable no-param-reassign */
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const _ = require('lodash');
const { forEach } = require('lodash');

const { QUESTION_TYPES, QUESTION_RESPONSE_STATUS } = require('../../config/constants');
const { getByIds } = require('../questions/getByIds');

const { getUserQuestionResponses } = require('./getUserQuestionResponses');
const { shortResponseIsCorrect } = require('./helpers/checkResponseByQuestionType');
const { getConfigByInstance } = require('./helpers/getConfigByInstance');
const { getQuestionClues } = require('./helpers/getQuestionClues');

dayjs.extend(duration);

async function calculateUserAgentInstanceNote({ instanceId, userAgent, ctx }) {
  const instance = await ctx.tx.call('assignables.assignableInstances.getAssignableInstance', {
    id: instanceId,
    details: true,
  });

  const [evaluationSystem, questionResponses, questions] = await Promise.all([
    ctx.tx.call('academic-portfolio.programs.getProgramEvaluationSystem', {
      id: instance.subjects[0].program,
    }),
    getUserQuestionResponses({ instance: instance.id, userAgent, ctx }),
    getByIds({ id: instance.metadata.questions, ctx }),
  ]);

  const perQuestion =
    (evaluationSystem.maxScale.number - evaluationSystem.minScale.number) / questions.length;

  const config = getConfigByInstance(instance);
  const cluesConfigByType = _.keyBy(config.clues, 'type');

  const perError = -(perQuestion * (config.wrong / 100));
  const perDone = perQuestion;
  const perUndefined = -(perQuestion * (config.omit / 100));

  let note = evaluationSystem.minScale.number;
  const questionsCorrected = {};

  function getClueLessPoints(question) {
    const usedClues = questionResponses[question.id].clues;
    const clues = getQuestionClues(question, 99999, config);
    let clueLessPoints = 0;
    forEach(clues, (clue, index) => {
      if (index < usedClues) {
        const lessPoints = perQuestion * (cluesConfigByType[clue.type].value / 100);
        clueLessPoints += lessPoints;
      }
    });
    return clueLessPoints;
  }

  _.forEach(questions, (question) => {
    if (question.type === QUESTION_TYPES.SHORT_RESPONSE) {
      const response = questionResponses[question.id]?.properties?.response;
      if (!response?.length) {
        note += perUndefined;
        questionsCorrected[question.id] = {
          points: perUndefined,
          status: QUESTION_RESPONSE_STATUS.UNDEFINED,
        };
      } else if (shortResponseIsCorrect(response, question, config)) {
        note += perDone - getClueLessPoints(question);
        questionsCorrected[question.id] = {
          points: perDone - getClueLessPoints(question),
          status: QUESTION_RESPONSE_STATUS.OK,
        };
      } else {
        note += perError;
        questionsCorrected[question.id] = {
          points: perError,
          status: QUESTION_RESPONSE_STATUS.KO,
        };
      }
    } else if (question.type === QUESTION_TYPES.MONO_RESPONSE) {
      const correctIndex = _.findIndex(question.choices, {
        isCorrect: true,
      });

      const response = questionResponses[question.id]?.properties?.response;
      if (!_.isNumber(response)) {
        note += perUndefined;
        questionsCorrected[question.id] = {
          points: perUndefined,
          status: QUESTION_RESPONSE_STATUS.UNDEFINED,
        };
      } else if (response === correctIndex) {
        note += perDone - getClueLessPoints(question);
        questionsCorrected[question.id] = {
          points: perDone - getClueLessPoints(question),
          status: QUESTION_RESPONSE_STATUS.OK,
        };
      } else {
        note += perError;
        questionsCorrected[question.id] = {
          points: perError,
          status: QUESTION_RESPONSE_STATUS.KO,
        };
      }
    } else if (question.type === QUESTION_TYPES.MAP) {
      if (questionResponses[question.id]?.properties?.responses) {
        let allWithValues = true;
        let allValuesGood = true;

        _.forEach(question.mapProperties.markers.list, (r, index) => {
          if (!_.isNumber(questionResponses[question.id].properties.responses[index])) {
            allWithValues = false;
          }
          if (questionResponses[question.id].properties.responses[index] !== index) {
            allValuesGood = false;
          }
        });
        if (allWithValues && allValuesGood) {
          note += perDone - getClueLessPoints(question);
          questionsCorrected[question.id] = {
            points: perDone - getClueLessPoints(question),
            status: QUESTION_RESPONSE_STATUS.OK,
          };
        } else if (allWithValues) {
          note += perError;
          questionsCorrected[question.id] = {
            points: perError,
            status: QUESTION_RESPONSE_STATUS.KO,
          };
        } else {
          note += perUndefined;
          questionsCorrected[question.id] = {
            points: perUndefined,
            status: QUESTION_RESPONSE_STATUS.UNDEFINED,
          };
        }
      } else {
        note += perUndefined;
        questionsCorrected[question.id] = {
          points: perUndefined,
          status: QUESTION_RESPONSE_STATUS.UNDEFINED,
        };
      }
    } else if (question.type === QUESTION_TYPES.TRUE_FALSE) {
      const questionIsTrue = question.trueFalseProperties.isTrue;
      const response = questionResponses[question.id]?.properties?.response;

      if (typeof response !== 'boolean') {
        note += perUndefined;
        questionsCorrected[question.id] = {
          points: perUndefined,
          status: QUESTION_RESPONSE_STATUS.UNDEFINED,
        };
      } else if (response === questionIsTrue) {
        note += perDone - getClueLessPoints(question);
        questionsCorrected[question.id] = {
          points: perDone - getClueLessPoints(question),
          status: QUESTION_RESPONSE_STATUS.OK,
        };
      } else {
        note += perError;
        questionsCorrected[question.id] = {
          points: perError,
          status: QUESTION_RESPONSE_STATUS.KO,
        };
      }
    } else if (question.type === QUESTION_TYPES.OPEN_RESPONSE) {
      note += perUndefined;
      questionsCorrected[question.id] = {
        points: perUndefined,
        status: QUESTION_RESPONSE_STATUS.NOT_GRADED,
      };
    }
  });

  return { note, questions: questionsCorrected };
}

module.exports = { calculateUserAgentInstanceNote };
