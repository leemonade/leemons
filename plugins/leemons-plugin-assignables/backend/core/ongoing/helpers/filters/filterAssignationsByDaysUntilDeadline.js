const dayjs = require('dayjs');

function filterAssignationsByDaysUntilDeadline({
  assignations,
  dates,
  min = 0,
  max = Infinity,
  excludeFinished,
}) {
  const instancesDates = dates.instances;
  const assignationsDates = dates.assignations;

  const now = dayjs();
  return assignations.filter((assignation) => {
    if (excludeFinished) {
      const finished = dayjs(assignationsDates[assignation.id]?.end || null);
      if (finished.isValid()) {
        return false;
      }
    }

    const deadline = dayjs(instancesDates[assignation.instance.id]?.deadline || null);
    let daysUntilDeadline;

    if (!deadline.isValid()) {
      daysUntilDeadline = Infinity;
    } else {
      daysUntilDeadline = deadline.diff(now, 'days', true);
    }

    return min < daysUntilDeadline && max >= daysUntilDeadline;
  });
}

module.exports = {
  filterAssignationsByDaysUntilDeadline,
};
