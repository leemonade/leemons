/* eslint-disable no-param-reassign */
const _ = require('lodash');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { getUserQuestionResponses } = require('./getUserQuestionResponses');
const { getByIds } = require('../questions/getByIds');

dayjs.extend(duration);

async function calculeUserAgentInstanceNote(
  instanceId,
  userAgent,
  { userSession, transacting } = {}
) {
  const { assignableInstances: assignableInstancesService } =
    leemons.getPlugin('assignables').services;
  const { programs: programsService } = leemons.getPlugin('academic-portfolio').services;

  const instance = await assignableInstancesService.getAssignableInstance(instanceId, {
    userSession,
    details: true,
    transacting,
  });

  const [evaluationSystem, questionResponses, questions] = await Promise.all([
    programsService.getProgramEvaluationSystem(instance.assignable.subjects[0].program, {
      userSession,
      transacting,
    }),
    getUserQuestionResponses(instance.id, userAgent, {
      userSession,
      transacting,
    }),
    getByIds(instance.metadata.questions, {
      userSession,
      transacting,
    }),
  ]);

  const perError = -(
    (evaluationSystem.maxScale.number - evaluationSystem.minScale.number) /
    questions.length /
    2
  );
  const perDone =
    (evaluationSystem.maxScale.number - evaluationSystem.minScale.number) / questions.length;
  const perUndefined = 0;

  let note = evaluationSystem.minScale.number;

  _.forEach(questions, (question) => {
    if (question.type === 'mono-response') {
      const correctIndex = _.findIndex(question.properties.responses, {
        value: { isCorrectResponse: true },
      });
      if (!_.isNumber(questionResponses[question.id]?.properties?.response)) {
        note += perUndefined;
      } else if (questionResponses[question.id].properties.response === correctIndex) {
        note += perDone;
      } else {
        note += perError;
      }
    }
    if (question.type === 'map') {
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
          note += perDone;
        } else if (allWithValues) {
          note += perError;
        } else {
          note += perUndefined;
        }
      } else {
        note += perUndefined;
      }
    }
  });

  return note;
}

module.exports = { calculeUserAgentInstanceNote };
