const { map, toArray } = require('lodash');
const { scormProgress } = require('../../tables');

function getScormGrade({ state, numberOfQuestions }) {
  if (state?.cmi?.score?.raw && state?.cmi?.score?.min && state?.cmi?.score?.max) {
    const raw = state?.cmi?.score?.raw;
    const min = state?.cmi?.score?.min;
    const max = state?.cmi?.score?.max;

    return { raw, min, max };
  }
  if (state?.cmi?.score?.scaled) {
    const min = 0;
    const max = 1;
    const raw = Math.abs(state?.cmi?.score?.scaled);

    return { raw, min, max };
  }
  if (Object.keys(state?.cmi?.interactions)?.length) {
    const interactions = toArray(state?.cmi?.interactions);
    const attemptsUsed = numberOfQuestions
      ? Math.floor(interactions.length / numberOfQuestions)
      : 1;

    const firstQuestion = (attemptsUsed - 1) * numberOfQuestions;
    const lastQuestion = firstQuestion + numberOfQuestions;

    const interactionsToCheck = interactions.slice(firstQuestion, lastQuestion);

    let correctAnswers = 0;
    interactionsToCheck.forEach((interaction) => {
      if (interaction.result === 'correct') {
        correctAnswers++;
      }
    });

    return {
      raw: correctAnswers,
      min: 0,
      max: Math.max(interactionsToCheck.length, numberOfQuestions),
    };
  }

  return {
    raw: 0,
    min: 0,
    max: 1,
  };
}

function getScaledGrade({ grade, evaluationSystem }) {
  const lMin = evaluationSystem?.minScale?.number;
  const lMax = evaluationSystem?.maxScale?.number;

  /*
    The scorm grade has it's own min and max values, so we need to convert it
    to a program evaluation system range valid grade, so we need to convert them
    by using the following fomulas:

    A scalar is a number between 0 and 1
    A scalar is obtained by the formula:

     * scalar = (raw - min) / (max - min)

      Example 5[raw](0[min],10[max]) -> (5 - 0) / (10 - 0) = 5 / 10 = 0.5
      Example 7.5(5,10) -> (7.5 - 5) / (10 - 5) = 2.5 / 5 = 0.5
      Example 0(-100,100) -> (0 - (-100)) / (100 - (-100)) = 100 / 200 = 0.5

    Then we need to obtain the program evaluation system scaled grade which is
    obtained by rearranging the formular

    * raw = scalar * (max - min) + min

      Example 0.5(0, 10) -> 0.5 * (10 - 0) + 0 = 5
      Example 0.5(5,10) -> 0.5 * (10 - 5) + 5 = 7.5
      Example 0.5(-100,100) -> 0.5 * (100 - (-100)) + (-100) = 0.5 * (100 + 100) - 100 = 0

    To join them in a one line formula, we have the following one:

    * lGrade = (sRaw - sMin)(lMax-lMin)/(Smax-Smin)+lMin
  */

  const { min: sMin, max: sMax } = grade;

  let sRaw = grade.raw;
  if (sRaw <= sMin) {
    sRaw = sMin;
  } else if (sRaw >= sMax) {
    sRaw = sMax;
  }

  return ((sRaw - sMin) * (lMax - lMin)) / (sMax - sMin) + lMin;
}

module.exports = async function updateStatus(
  { instance: instanceId, user, state },
  { userSession, transacting }
) {
  const userAgentIds = map(userSession.userAgents, 'id');
  const isUser = userAgentIds.includes(user);

  if (!isUser) {
    throw new Error('Only the assignation student can update the scorm status');
  }

  const { assignableInstances, assignations } = leemons.getPlugin('assignables').services;

  const instance = await assignableInstances.getAssignableInstance(instanceId, {
    details: true,
    userSession,
    transacting,
  });

  if (instance.assignable.role !== 'scorm') {
    throw new Error('This service can only update scorm grades');
  }

  const classes = instance?.subjects;
  const program = classes?.[0]?.program;
  const evaluationSystem = await leemons
    .getPlugin('academic-portfolio')
    .services.programs.getProgramEvaluationSystem(program);

  const grade = getScormGrade({
    state,
    numberOfQuestions: instance.assignable.metadata.numberOfAttempts ?? 0,
  });

  const scaledGrade = getScaledGrade({ grade, evaluationSystem });

  await Promise.all([
    scormProgress.set({ instance: instanceId, user }, { state }, { transacting }),
    assignations.updateAssignation(
      {
        assignableInstance: instanceId,
        user,
        grades: classes.map((klass) => ({
          subject: klass.subject,
          type: 'main',
          grade: scaledGrade,
          gradedBy: 'auto-graded',
        })),
      },
      { userSession, transacting }
    ),
  ]);
};
