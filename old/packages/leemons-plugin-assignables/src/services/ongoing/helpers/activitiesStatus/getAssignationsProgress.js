const { map, groupBy } = require('lodash');
const dayjs = require('dayjs');
const tables = require('../../../tables');

async function getAssignationsProgress({
  dates,
  assignations,
  instanceSubjectsProgramsAndClasses,
}) {
  const grades = groupBy(
    await tables.grades.find({
      assignation_$in: map(assignations, 'id'),
      type: 'main',
      visibleToStudent: true,
    }),
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
