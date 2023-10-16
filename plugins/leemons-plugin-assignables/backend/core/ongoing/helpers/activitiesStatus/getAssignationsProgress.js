const { map, groupBy } = require('lodash');
const dayjs = require('dayjs');

async function getAssignationsProgress({
  dates,
  assignations,
  instanceSubjectsProgramsAndClasses,
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
    const { instance } = assignation;
    const { requiresScoring, allowFeedback, alwaysAvailable: isAlwaysAvailable } = instance;

    const isEvaluable = requiresScoring || allowFeedback;
    // TODO: Add if has any feedback when only allowFeedback
    const hasAllGrades =
      grades[assignation.id]?.length ===
      instanceSubjectsProgramsAndClasses[assignation.instance.id]?.subjects?.length;
    const hasBeenEvaluated = isEvaluable && hasAllGrades;

    const now = dayjs();
    const deadline = dayjs(dates.instances[instance.id]?.deadline || null);
    const closeDate = dayjs(dates.instances[instance.id]?.closed || null);

    const startTime = dayjs(dates.assignations[assignation.id]?.start || null);
    const endTime = dayjs(dates.assignations[assignation.id]?.end || null);

    const activityHasBeenClosed = isAlwaysAvailable
      ? closeDate.isValid() && !now.isBefore(closeDate)
      : deadline.isValid() && !now.isBefore(deadline);

    const studentHasStarted = startTime.isValid();
    const studentHasFinished = endTime.isValid();

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
