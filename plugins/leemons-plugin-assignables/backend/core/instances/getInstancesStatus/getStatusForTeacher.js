const dayjs = require('dayjs');

const INSTANCE_STATUS = {
  EVALUATED: 'evaluated',
  EVALUATING: 'started',
  NEEDS_EVALUATION: 'opened',
  NOT_FINISHED_BY_STUDENTS: 'assigned',
};

function getAssignationsStatusCount({
  assignations,
  requiresScoring,
  activityFinished,
  requiredGradesCount,
}) {
  let evaluatedCount = 0;
  let hasGradesCount = 0;
  let didNotFinished = 0;
  let needsEvaluation = 0;

  assignations.forEach((assignation) => {
    const hasAllGrades = assignation?.grades?.length >= requiredGradesCount;
    const hasGrades = !!assignation?.grades?.length;
    const didFinish = !!assignation?.timestamps?.end || activityFinished;

    if (!requiresScoring && didFinish) {
      evaluatedCount++;

      return;
    }

    if (!didFinish) {
      didNotFinished++;

      return;
    }

    if (hasGrades) {
      hasGradesCount++;
    }

    if (hasAllGrades) {
      evaluatedCount++;

      return;
    }

    needsEvaluation++;
  });

  return {
    evaluatedCount,
    hasGradesCount,
    didNotFinished,
    needsEvaluation,
  };
}

function getStatusForTeacher(instance, { requiredGradesCount }) {
  const requiresScoring = instance?.requiresScoring;
  const activityFinished =
    !instance.alwaysAvailable && dayjs(instance?.dates?.deadline).isBefore(dayjs());
  const assignationsCount = instance?.assignations?.length ?? 0;

  const { evaluatedCount, hasGradesCount, didNotFinished, needsEvaluation } =
    getAssignationsStatusCount({
      assignations: instance?.assignations ?? [],
      requiresScoring,
      activityFinished,
      requiredGradesCount,
    });

  if (assignationsCount === needsEvaluation) {
    return INSTANCE_STATUS.NEEDS_EVALUATION;
  }
  if (assignationsCount === evaluatedCount) {
    return INSTANCE_STATUS.EVALUATED;
  }
  if (assignationsCount === hasGradesCount) {
    return INSTANCE_STATUS.EVALUATING;
  }
  if (didNotFinished) {
    return INSTANCE_STATUS.NOT_FINISHED_BY_STUDENTS;
  }

  return null;
}

module.exports = { getStatusForTeacher, INSTANCE_STATUS };
