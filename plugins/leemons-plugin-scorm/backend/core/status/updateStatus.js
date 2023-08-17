const { map, toArray, uniqBy } = require('lodash');
const { scormProgress } = require('../../tables');

function getScormGrade({ state, numberOfQuestions }) {
  if (state?.cmi?.score?.raw && state?.cmi?.score?.min && state?.cmi?.score?.max) {
    const raw = parseInt(state?.cmi?.score?.raw, 10);
    const min = parseInt(state?.cmi?.score?.min, 10);
    const max = parseInt(state?.cmi?.score?.max, 10);

    return { raw, min, max };
  }
  if (state?.cmi?.score?.scaled) {
    const min = 0;
    const max = 1;
    const raw = Math.abs(state?.cmi?.score?.scaled);

    return { raw, min, max };
  }
  if (state?.cmi?.interactions && Object.keys(state.cmi.interactions)?.length) {
    const interactions = toArray(state?.cmi?.interactions);
    const questionsLength = numberOfQuestions ?? uniqBy(interactions, 'id')?.length;
    const attemptsUsed = Math.floor(interactions.length / questionsLength);

    const firstQuestion = (attemptsUsed - 1) * questionsLength;
    const lastQuestion = firstQuestion + questionsLength;

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
      max: Math.max(interactionsToCheck.length, questionsLength),
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

function getLeemonsScormObject({ assignable, state }) {
  if (assignable?.metadata?.version === 'scorm2004') {
    return {
      cmi: {
        interactions: state?.cmi?.interaction,
        score: state?.cmi?.score,
      },
    };
  }
  if (assignable?.metadata?.version === 'scorm12') {
    return {
      cmi: {
        interactions: state?.cmi?.interactions,
        score: state?.cmi?.core?.score,
      },
    };
  }

  return {};
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

  const leemonsScormState = getLeemonsScormObject({ assignable: instance?.assignable, state });

  if (instance.assignable.role !== 'scorm') {
    throw new Error('This service can only update scorm grades');
  }

  const classes = instance?.subjects;
  const program = classes?.[0]?.program;
  const evaluationSystem = await leemons
    .getPlugin('academic-portfolio')
    .services.programs.getProgramEvaluationSystem(program);

  const grade = getScormGrade({
    state: leemonsScormState,
    numberOfQuestions: instance.assignable.metadata.numberOfAttempts ?? null,
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
