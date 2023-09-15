/* eslint-disable no-param-reassign */
const _ = require('lodash');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { keyBy, forEach } = require('lodash');
const { getUserQuestionResponses } = require('./getUserQuestionResponses');
const { getByIds } = require('../questions/getByIds');
const {
  getQuestionClues,
} = require('../../../frontend/src/pages/private/tests/StudentInstance/helpers/getQuestionClues');
const {
  getConfigByInstance,
} = require('../../../frontend/src/pages/private/tests/StudentInstance/helpers/getConfigByInstance');

dayjs.extend(duration);

async function calculeUserAgentInstanceNote({ instanceId, userAgent, ctx }) {
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
  const questionsResponse = {};

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
    if (question.type === 'mono-response') {
      const correctIndex = _.findIndex(question.properties.responses, {
        value: { isCorrectResponse: true },
      });
      if (!_.isNumber(questionResponses[question.id]?.properties?.response)) {
        note += perUndefined;
        questionsResponse[question.id] = {
          points: perUndefined,
          status: null,
        };
      } else if (questionResponses[question.id].properties.response === correctIndex) {
        note += perDone - getClueLessPoints(question);
        questionsResponse[question.id] = {
          points: perDone - getClueLessPoints(question),
          status: 'ok',
        };
      } else {
        note += perError;
        questionsResponse[question.id] = {
          points: perError,
          status: 'ko',
        };
      }
    } else if (question.type === 'map') {
      if (questionResponses[question.id]?.properties?.responses) {
        let allWithValues = true;
        let allValuesGood = true;
        _.forEach(question.properties.markers.list, (r, index) => {
          if (!_.isNumber(questionResponses[question.id].properties.responses[index])) {
            allWithValues = false;
          }
          if (questionResponses[question.id].properties.responses[index] !== index) {
            allValuesGood = false;
          }
        });
        if (allWithValues && allValuesGood) {
          note += perDone - getClueLessPoints(question);
          questionsResponse[question.id] = {
            points: perDone - getClueLessPoints(question),
            status: 'ok',
          };
        } else if (allWithValues) {
          note += perError;
          questionsResponse[question.id] = {
            points: perError,
            status: 'ko',
          };
        } else {
          note += perUndefined;
          questionsResponse[question.id] = {
            points: perUndefined,
            status: null,
          };
        }
      } else {
        note += perUndefined;
        questionsResponse[question.id] = {
          points: perUndefined,
          status: null,
        };
      }
    }
  });

  return { note, questions: questionsResponse };
}

module.exports = { calculeUserAgentInstanceNote };
