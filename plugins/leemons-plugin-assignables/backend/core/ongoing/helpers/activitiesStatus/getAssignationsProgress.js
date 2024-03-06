const { map, groupBy } = require('lodash');
const dayjs = require('dayjs');

function getDates(dates, instance, assignation) {
  const now = dayjs();
  const deadline = dayjs(dates.instances[instance.id]?.deadline || null);
  const closeDate = dayjs(dates.instances[instance.id]?.closed || null);

  const startTime = dayjs(dates.assignations[assignation.id]?.start || null);
  const endTime = dayjs(dates.assignations[assignation.id]?.end || null);
  return { closeDate, now, deadline, startTime, endTime };
}

function getDatesStatus({
  dates,
  assignation,
  includeNonEvaluableChildren,
  instanceSubjectsProgramsAndClasses,
  grades,
}) {
  const { instance } = assignation;
  const { requiresScoring, allowFeedback, alwaysAvailable: isAlwaysAvailable } = instance;
  const { closeDate, now, deadline, startTime, endTime } = getDates(dates, instance, assignation);

  const isModuleChild = instance.metadata?.module?.type === 'activity';
  const isEvaluable = requiresScoring || allowFeedback;

  const hasAllGrades =
    grades[assignation.id]?.length > 0 &&
    grades[assignation.id]?.length ===
      instanceSubjectsProgramsAndClasses[assignation.instance.id]?.subjects?.length;

  const studentHasStarted = startTime.isValid();
  const studentHasFinished = endTime.isValid();

  const activityHasBeenClosed = isAlwaysAvailable
    ? closeDate.isValid() && !now.isBefore(closeDate)
    : deadline.isValid() && !now.isBefore(deadline);

  const hasBeenEvaluated =
    isModuleChild && includeNonEvaluableChildren
      ? (studentHasFinished || activityHasBeenClosed) && (!isEvaluable || hasAllGrades)
      : (studentHasFinished || activityHasBeenClosed) && isEvaluable && hasAllGrades;

  return { hasBeenEvaluated, activityHasBeenClosed, studentHasFinished, studentHasStarted };
}

async function getAssignationsProgress({
  dates = { instances: {}, assignations: {} },
  assignations,
  instanceSubjectsProgramsAndClasses,
  includeNonEvaluableChildren,
  ctx,
}) {
  const grades = groupBy(
    await ctx.tx.db.Grades.find({
      assignation: map(assignations, 'id'),
      type: 'main',
      visibleToStudent: true,
    }).lean(),
    'assignation'
  );

  return assignations.map((assignation) => {
    const { hasBeenEvaluated, activityHasBeenClosed, studentHasFinished, studentHasStarted } =
      getDatesStatus({
        dates,
        assignation,
        includeNonEvaluableChildren,
        grades,
        instanceSubjectsProgramsAndClasses,
      });

    if (hasBeenEvaluated) {
      return 'evaluated';
    }

    if (activityHasBeenClosed && !studentHasFinished) {
      return 'notSubmitted';
    }

    if (!studentHasStarted) {
      return 'notStarted';
    }

    if (studentHasFinished) {
      return 'finished';
    }

    return 'started';
  });
}
exports.getAssignationsProgress = getAssignationsProgress;
