const { getAssignationsProgress } = require('../activitiesStatus');

async function filterAssignationsByProgress({
  assignations,
  dates,
  filters,
  instanceSubjectsProgramsAndClasses,
  ctx,
}) {
  const { progress: desiredProgress } = filters;

  if (
    !['notSubmitted', 'notStarted', 'evaluated', 'finished', 'started'].includes(desiredProgress)
  ) {
    return assignations;
  }

  const assignationsProgress = await getAssignationsProgress({
    dates,
    assignations,
    instanceSubjectsProgramsAndClasses,
    ctx,
  });

  const progressByAssignation = {};
  assignationsProgress.forEach((progress, i) => {
    progressByAssignation[assignations[i].id] = progress;
  });

  return assignations.filter(
    (assignation) => progressByAssignation[assignation.id] === desiredProgress
  );
}
module.exports = { filterAssignationsByProgress };
