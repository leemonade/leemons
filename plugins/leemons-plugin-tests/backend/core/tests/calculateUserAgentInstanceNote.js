/* eslint-disable no-param-reassign */
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { keyBy } = require('lodash');

const { QUESTION_TYPES } = require('../../config/constants');
const { getByIds } = require('../questions/getByIds');

const { getUserQuestionResponses } = require('./getUserQuestionResponses');
const { getConfigByInstance } = require('./helpers/getConfigByInstance');
const {
  gradeMonoResponseQuestion,
  gradeMapQuestion,
  gradeTrueFalseQuestion,
  gradeShortResponseQuestion,
  gradeOpenQuestion,
} = require('./helpers/gradeQuestions');

dayjs.extend(duration);

const QUESTION_GRADING_FUNCTIONS_BY_TYPE = {
  [QUESTION_TYPES.MONO_RESPONSE]: gradeMonoResponseQuestion,
  [QUESTION_TYPES.MAP]: gradeMapQuestion,
  [QUESTION_TYPES.TRUE_FALSE]: gradeTrueFalseQuestion,
  [QUESTION_TYPES.SHORT_RESPONSE]: gradeShortResponseQuestion,
  [QUESTION_TYPES.OPEN_RESPONSE]: gradeOpenQuestion,
};

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

  const pointsPerQuestion =
    (evaluationSystem.maxScale.number - evaluationSystem.minScale.number) / questions.length;
  const config = getConfigByInstance(instance);
  const cluesConfigByType = keyBy(config.clues, 'type');

  let note = evaluationSystem.minScale.number;
  const correctedQuestions = {};

  questions.forEach((question) => {
    const responseData = questionResponses[question.id];
    const gradingFunction = QUESTION_GRADING_FUNCTIONS_BY_TYPE[question.type];

    const { points, status } = gradingFunction({
      responseData,
      question,
      config,
      pointsPerQuestion,
      cluesConfigByType,
    });

    note += points;
    correctedQuestions[question.id] = {
      points,
      status,
    };
  });

  return { note, questions: correctedQuestions };
}

module.exports = { calculateUserAgentInstanceNote };
