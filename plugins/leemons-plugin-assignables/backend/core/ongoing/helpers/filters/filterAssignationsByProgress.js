const { getAssignationsProgress } = require('../activitiesStatus');

async function filterAssignationsByProgress({
  assignations,
  dates,
  filters,
  instanceSubjectsProgramsAndClasses,
  includeNonEvaluableChildren,
  ctx,
}) {
  const { progress: desiredProgress } = filters;

  const desiredProgresses = Array.isArray(desiredProgress) ? desiredProgress : [desiredProgress];
  if (
    !desiredProgress ||
    !desiredProgresses.every((progress) =>
      ['notSubmitted', 'notStarted', 'evaluated', 'finished', 'started'].includes(progress)
    )
  ) {
    return assignations;
  }

  const assignationsProgress = await getAssignationsProgress({
    dates,
    assignations,
    instanceSubjectsProgramsAndClasses,
    includeNonEvaluableChildren,
    ctx,
  });

  const progressByAssignation = {};
  assignationsProgress.forEach((progress, i) => {
    progressByAssignation[assignations[i].id] = progress;
  });

  return assignations.filter((assignation) =>
    desiredProgresses.includes(progressByAssignation[assignation.id])
  );
}
module.exports = { filterAssignationsByProgress };
